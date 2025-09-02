import json
import time
# --- CHANGE: Import gevent and its lock ---
import gevent
from gevent.queue import Queue
from gevent.lock import BoundedSemaphore

class SseService:
    def __init__(self):
        self.listeners = {}
        # --- CHANGE: Use gevent's Semaphore as a lock ---
        self._lock = BoundedSemaphore()
        
        # --- CHANGE: Spawn a gevent greenlet instead of a thread ---
        self._heartbeat_greenlet = gevent.spawn(self._send_heartbeats)
        print("SSE Heartbeat greenlet started.")

    def _send_heartbeats(self):
        """
        Runs in a background greenlet, sending a heartbeat to all active listeners
        every 10 seconds to keep SSE connections alive.
        """
        while True:
            # --- CHANGE: Use gevent.sleep for cooperative multitasking ---
            gevent.sleep(10)

            with self._lock:
                if not self.listeners:
                    continue

                heartbeat_data = {"heartbeat": True, "timestamp": time.time()}

                for request_id, queues in list(self.listeners.items()):
                    for q in list(queues):
                        try:
                            q.put(json.dumps(heartbeat_data))
                        except Exception as e:
                            print(f"Error putting heartbeat in queue for {request_id}: {e}")

            # This log can be very noisy, let's make it less frequent or remove for production
            # print(f"Sent heartbeat to {sum(len(v) for v in self.listeners.values())} active listeners.")

    def subscribe(self, request_id):
        with self._lock:
            q = Queue()
            self.listeners.setdefault(request_id, []).append(q)
            print(f"Client subscribed to {request_id}. Total listeners: {len(self.listeners[request_id])}")
            return q

    def publish(self, request_id, data):
        with self._lock:
            queues = self.listeners.get(request_id, [])
            if not queues:
                return
            
            json_data = json.dumps(data)
            for q in list(queues):
                try:
                    q.put(json_data)
                except Exception as e:
                    print(f"Error putting message in queue for {request_id}: {e}")

    def unsubscribe(self, request_id, q):
        with self._lock:
            if request_id in self.listeners and q in self.listeners[request_id]:
                self.listeners[request_id].remove(q)
                if not self.listeners[request_id]:
                    del self.listeners[request_id]
                print(f"Client unsubscribed from {request_id}. Remaining listeners: {len(self.listeners.get(request_id, []))}")

sse_service = SseService()