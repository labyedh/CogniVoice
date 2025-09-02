import { LegacyAnalysisResult } from '../types';
import { apiClient } from './index';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5000';

const recommendations = [
    'Consider consulting with a healthcare professional for further evaluation.',
    'Regular cognitive exercises may be beneficial for maintaining brain health.',
    'Maintain social engagement and mental stimulation through hobbies and activities.'
];

export const analyzeAudio = async (
  audioFile: File | Blob,
  onStepCompleteRef: React.MutableRefObject<((step: number) => void) | undefined>
): Promise<LegacyAnalysisResult> => {
    console.log("Starting analyzeAudio function...");
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('audio', audioFile, audioFile instanceof File ? audioFile.name : 'recording.wav');
        const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        formData.append('requestId', requestId);
        console.log(`Generated Request ID: ${requestId}`);

        const eventSourceUrl = `${API_BASE_URL}/progress/${requestId}`;
        console.log(`Connecting to EventSource at: ${eventSourceUrl}`);
        const eventSource = new EventSource(eventSourceUrl);
        
        const closeConnection = (reason: string) => {
            if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
                console.log(`Closing SSE connection due to: ${reason}`);
                eventSource.close();
            }
        };

        eventSource.onopen = () => console.log("SSE Connection successfully opened.");

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
        
                if (data.heartbeat) {
                    console.log("Heartbeat received, keeping connection alive.");
                    return; // Correctly ignore the heartbeat and wait for the next message
                }
        
                console.log("SSE Message received:", event.data);
        
                if (data.result?.error) {
                    reject(new Error(data.result.error));
                    closeConnection("Backend error received");
                    return;
                }
        
                if (data.step !== undefined && !data.is_final) {
                    console.log(`Progress update: Step ${data.step}`);
                    onStepCompleteRef.current?.(data.step);
                    return;
                }
        
                if (data.is_final && data.result) {
                    console.log("Final result received. Resolving promise.");
                    const finalResult: LegacyAnalysisResult = {
                        id: `analysis_${requestId}`,
                        riskLevel: data.result.riskLevel,
                        recommendations: recommendations,
                        timestamp: new Date().toISOString(),
                        backendData: data.result
                    };
                    resolve(finalResult);
                    closeConnection("Final result received");
                    return;
                }
            } catch (error) {
                console.error("Failed to parse server message:", event.data, error);
                reject(new Error('Failed to parse server message.'));
                closeConnection("Message parsing error");
            }
        };

        eventSource.onerror = () => {
            reject(new Error('Connection to the analysis server failed. Ensure the backend is running.'));
            closeConnection("onerror event");
        };

        apiClient('/predict', { method: 'POST', body: formData })
            .then(data => console.log('Analysis job successfully started:', data?.message))
            .catch(error => {
                reject(error);
                closeConnection("/predict call failed");
            });
    });
};