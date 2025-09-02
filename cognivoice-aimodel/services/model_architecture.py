import torch
import torch.nn as nn

# You can rename this file to avoid confusion if you wish
class CNN_LSTM_Architecture(nn.Module):
    def __init__(self, num_classes=1): # Default num_classes to 1 for binary
        super(CNN_LSTM_Architecture, self).__init__()

        self.cnn = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(16),
            nn.AvgPool2d(2),  # 224 → 112
            nn.ReLU(),

            nn.Conv2d(16, 32, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(32),
            nn.AvgPool2d(2),  # 112 → 56
            nn.ReLU(),
            nn.Dropout(0.1),

            nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(64),
            nn.AvgPool2d(2),  # 56 → 28
            nn.ReLU(),
            nn.Dropout(0.1),

            nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(128),
            nn.AvgPool2d(2),  # 28 → 14
            nn.ReLU(),
            nn.Dropout(0.1),

            nn.Conv2d(128, 256, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(256),# no pooling
            nn.ReLU()
        )

        # Global Average Pooling → output shape: (B, 256, 1, 1)
        self.global_avg_pool =nn.AdaptiveAvgPool2d((1, 1))  # 256×HxW → 256×1×1
        

        # LSTM input: (batch, seq_len=1, input_size=256)
        self.lstm = nn.LSTM(
            input_size=256,
            hidden_size=128,
            batch_first=True,
            num_layers=5
        )

        self.classifier = nn.Sequential(
            nn.BatchNorm1d(128),
            nn.Dropout(0.5),
            nn.Linear(128, 1)
        )

    def forward(self, x):
        x = self.cnn(x)  # (B, 256, H, W)
        x = self.global_avg_pool(x)  # (B, 256, 1, 1)
        x = x.view(x.size(0), 1, -1)  # (B, 1, 256)

        lstm_out, _ = self.lstm(x)  # (B, 1, 128)
        final_hidden = lstm_out[:, -1, :]  # (B, 128)

        return self.classifier(final_hidden)  # (B, 1) logits
