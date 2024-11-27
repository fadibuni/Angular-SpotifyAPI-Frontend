import { Component, OnInit } from "@angular/core";
import { GameProgressService } from "src/services/game-progress.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SharedService } from "src/services/shared.service";
import { DifficultyLevel } from "src/app/models/DifficultyLevel";

@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.css"],
})
export class ResultComponent implements OnInit {
  correctAnswers: number = 0;
  totalRounds: number = 0;
  totalPoints: number = 0;
  playerName: string = "";
  private pointsSubscription: Subscription = Subscription.EMPTY; // Subscription to manage cleanup
  private correctAnswersSubscription: Subscription = Subscription.EMPTY;
  difficulty: DifficultyLevel = DifficultyLevel.Easy;

  constructor(
    private gameProgressService: GameProgressService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.gameProgressService.correctAnswers$.subscribe((correctAnswers) => {
      this.correctAnswers = correctAnswers;
    });

    this.gameProgressService.points$.subscribe((points) => {
      this.totalPoints = points;
    });
  }

  ngOnInit(): void {
    this.totalRounds = this.gameProgressService.totalRounds;
  }

  ngOnDestroy(): void {
    if (this.pointsSubscription) {
      this.pointsSubscription.unsubscribe();
    }
    if (this.correctAnswersSubscription) {
      this.correctAnswersSubscription.unsubscribe();
    }
  }

  get resultMessage(): string {
    if (this.correctAnswers >= 3) {
      return `You win! Your total points: ${this.totalPoints}`;
    }
    return `You lose! Your total points: ${this.totalPoints}`;
  }

  submitScore = () => {
    console.log(this.playerName, this.totalPoints);
    if (this.playerName && this.totalPoints > 0) {
      this.sharedService.addScore(this.playerName, this.totalPoints);
      this.gameProgressService.resetGameProgress();
      this.router.navigate(["/leaderboard"]);
    }
  }

  navigateHome() {
    this.gameProgressService.resetGameProgress();
    this.router.navigate(["/"]);
  }
}
