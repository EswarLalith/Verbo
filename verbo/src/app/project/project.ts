import { Component, computed, inject, signal } from '@angular/core';
import { OptimizeService } from '../core/services/optimize.services';

@Component({
  selector: 'app-project',
  imports: [],
  standalone: true,
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project {
  private readonly optimizeService = inject(OptimizeService);
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  readonly userText = signal('');
  readonly optimizedText = signal('');
  readonly transcription = signal('');
  readonly loading = signal(false);
  readonly recording = signal(false);
  readonly audioOptimizing = signal(false);
  readonly audioBusy = computed(() => this.recording() || this.audioOptimizing());

  toggleRecording(): void {
    if (this.recording()) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  private startRecording(): void {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        this.sendAudio(audioBlob);
      };

      this.mediaRecorder.start();
      this.recording.set(true);
    });
  }

  private stopRecording(): void {
    this.mediaRecorder?.stop();
    this.recording.set(false);
  }

  private sendAudio(audio: Blob): void {
    this.loading.set(true);
    this.audioOptimizing.set(true);
    this.optimizeService.transcribe(audio).subscribe({
      next: (result) => {
        this.transcription.set(result.transcription);
        this.optimizedText.set(result.optimized_text);
        this.loading.set(false);
        this.audioOptimizing.set(false);
      },
      error: () => {
        this.transcription.set('Transcription failed. Please try again.');
        this.loading.set(false);
        this.audioOptimizing.set(false);
      },
    });
  }

  optimizeAudio(): void {
    const text = this.transcription();
    if (!text.trim()) {
      this.optimizedText.set('Enter the text first');
      return;
    }

    this.audioOptimizing.set(true);
    this.loading.set(true);
    this.optimizeService.optimize(text).subscribe({
      next: (result) => {
        this.optimizedText.set(result);
        this.audioOptimizing.set(false);
        this.loading.set(false);
      },
      error: () => {
        this.optimizedText.set('Something went wrong. Please try again.');
        this.audioOptimizing.set(false);
        this.loading.set(false);
      },
    });
  }

  optimize(): void {
    const text = this.userText();
    if (!text.trim()) {
      this.optimizedText.set('Enter the text first');
      return;
    }

    this.loading.set(true);
    this.optimizeService.optimize(text).subscribe({
      next: (result) => {
        this.optimizedText.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.optimizedText.set('Something went wrong. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
