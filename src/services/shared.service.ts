import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DifficultyLevel } from "src/app/models/DifficultyLevel";
import { GameConfig } from "src/app/models/GameConfig";
import { LeaderboardEntry } from "src/app/models/LeaderboardEntry";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  private gameConfigSource = new BehaviorSubject<GameConfig>({
    difficulty: DifficultyLevel.Easy,
  });
  gameConfig$ = this.gameConfigSource.asObservable();

  private leaderboard: LeaderboardEntry[] = [];

  get currentGameConfig() {
    return this.gameConfigSource.getValue();
  }

  updateDifficulty(newDifficulty: DifficultyLevel) {
    this.gameConfigSource.next({ difficulty: newDifficulty });
  }

  toCapitalCase(str: string) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  addScore(username: string, score: number) {
    username = this.toCapitalCase(username);
    const userIndex = this.leaderboard.findIndex(entry => entry.username === username);
    if (userIndex !== -1) {
      this.leaderboard[userIndex].score = Math.max(this.leaderboard[userIndex].score, score);
    } else {
      this.leaderboard.push({ username, score });
    }
    this.leaderboard = this.leaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  getLeaderboard() {
    return [...this.leaderboard];
  }
}
