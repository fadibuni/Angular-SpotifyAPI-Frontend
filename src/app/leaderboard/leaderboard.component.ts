import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
})
export class LeaderboardComponent implements OnInit {
  leaderboard: { username: string; score: number }[] = [];

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.leaderboard = this.sharedService.getLeaderboard();
  }

}
