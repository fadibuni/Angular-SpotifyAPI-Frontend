import { Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private sound: Howl | null = null;

  constructor() {}

  // Initialize the sound
  initializeSound(src: string): void {
    this.sound = new Howl({
      src: [src],
      volume: 0.5,
      onload: () => console.log('Audio loaded!'),
      onend: () => console.log('Playback finished!')
    });
  }

  // Play the sound
  play(): void {
    if (this.sound) {
      this.sound.play();
    }
  }

  // Pause the sound
  pause(): void {
    if (this.sound) {
      this.sound.pause();
    }
  }

  // Stop the sound
  stop(): void {
    if (this.sound) {
      this.sound.stop();
    }
  }

  // Set volume
  setVolume(volume: number): void {
    if (this.sound) {
      this.sound.volume(volume);
    }
  }

  // Set looping
  setLoop(loop: boolean): void {
    if (this.sound) {
      this.sound.loop(loop);
    }
  }
}
