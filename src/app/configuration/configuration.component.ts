import { Component, OnInit } from "@angular/core";
import { SharedService } from "src/services/shared.service";
import { Router } from "@angular/router";
import { DifficultyLevel } from "../models/DifficultyLevel";
@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.css"],
})
export class ConfigurationComponent {
  difficulty = DifficultyLevel;
  selectedDifficulty: DifficultyLevel = DifficultyLevel.Easy;

  constructor(private sharedService: SharedService) {
    this.sharedService.gameConfig$.subscribe((config) => {
      this.selectedDifficulty = config.difficulty;
    });
  }

  changeDifficulty(newDifficulty: DifficultyLevel) {
    this.sharedService.updateDifficulty(newDifficulty);
  }

}
