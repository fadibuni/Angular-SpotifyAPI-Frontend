import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DifficultyLevel } from 'src/app/models/DifficultyLevel';

@Injectable({
  providedIn: 'root',
})
export class GameProgressService {
  private totalRoundsSource = new BehaviorSubject<number>(5);
  private currentRoundSource = new BehaviorSubject<number>(0);
  private correctAnswersSource = new BehaviorSubject<number>(0);
  private pointsSource = new BehaviorSubject<number>(0); 

  totalRounds$ = this.totalRoundsSource.asObservable();
  currentRound$ = this.currentRoundSource.asObservable();
  correctAnswers$ = this.correctAnswersSource.asObservable();
  points$ = this.pointsSource.asObservable(); 

  setTotalRounds(total: number) {
    this.totalRoundsSource.next(total);
  }

  get totalRounds() {
    return this.totalRoundsSource.getValue();
  }

  get currentRound() {
    return this.currentRoundSource.getValue();
  }

  get correctAnswers() {
    return this.correctAnswersSource.getValue();
  }

  get points() {
    return this.pointsSource.getValue();
  }

  incrementRound() {
    this.currentRoundSource.next(this.currentRoundSource.getValue() + 1);
  }

  resetGameProgress() {
    this.currentRoundSource.next(0);
    this.correctAnswersSource.next(0);
  }

  resetRounds() {
    this.currentRoundSource.next(0);
  }
  incrementCorrectAnswers(difficulty: DifficultyLevel) {
    this.correctAnswersSource.next(this.correctAnswersSource.getValue() + 1);
    console.log('Correct Answers:', this.correctAnswers);
    this.updatePoints(difficulty);
  }

  updatePoints(difficulty: DifficultyLevel) {
    const points = this.calculatePoints(difficulty);
    console.log('Points:', points);
    this.pointsSource.next(points);
  }

  updateFinalPoints(difficulty: DifficultyLevel) {
    const points = this.calculatePoints(difficulty);
    this.pointsSource.next(points);
  }

  calculatePoints(difficulty: DifficultyLevel): number {
    const pointsPerCorrectAnswer = 20;
    let multiplier = 1;

    switch (difficulty) {
      case DifficultyLevel.Easy:
        multiplier = 1;
        break;
      case DifficultyLevel.Medium:
        multiplier = 2;
        break;
      case DifficultyLevel.Hard:
        multiplier = 3;
        break;
    }

    return this.correctAnswers * pointsPerCorrectAnswer * multiplier;
  }

  get gameProgress() {
    return {
      totalRounds: this.totalRoundsSource.getValue(),
      currentRound: this.currentRoundSource.getValue(),
      correctAnswers: this.correctAnswersSource.getValue(),
      points: this.pointsSource.getValue(),
    };
  }
}
