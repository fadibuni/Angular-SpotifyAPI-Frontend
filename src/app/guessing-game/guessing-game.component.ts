import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SharedService } from "src/services/shared.service";
import { GameProgressService } from "src/services/game-progress.service";
import { DifficultyLevel } from "../models/DifficultyLevel";
import { Howl } from "howler";
import fetchFromSpotify from "src/services/api";
import SpotifyTrack from "src/app/models/SpotifyTrack";
@Component({
  selector: "app-guessing-game",
  templateUrl: "./guessing-game.component.html",
  styleUrls: ["./guessing-game.component.css"],
})
export class GuessingGameComponent implements OnInit {
  currentTrack: SpotifyTrack | null = null;
  tracksArray: SpotifyTrack[] = [];
  fetchedTracks: any;
  numberOfChoices: number = 2;
  selectedTrack: SpotifyTrack | null = null;
  private sound: Howl | null = null; // Declare sound variable

  constructor(
    private sharedService: SharedService,
    private gameProgressService: GameProgressService,
    private router: Router
  ) {
    this.sharedService.gameConfig$.subscribe((config) => {
      this.numberOfChoices = this.setNumberOfChoices(config.difficulty);
    });
  }

  ngOnInit(): void {
    this.displayGame();
  }

  setNumberOfChoices(difficulty: DifficultyLevel) {
    switch (difficulty) {
      case DifficultyLevel.Easy:
        return 2;
      case DifficultyLevel.Medium:
        return 3;
      case DifficultyLevel.Hard:
        return 5;
    }
  }

  getRandomSearch() {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    return (
      characters.charAt(Math.floor(Math.random() * characters.length)) + "*"
    );
  }

  getRandomOffsetNumber(): number {
    return Math.floor(Math.random() * 5);
  }

  resetGameOnHomeClick = () => {
    this.gameProgressService.resetGameProgress();
    if (this.sound) {
      if (this.sound.playing()) {
        this.sound.pause();
      }
    }
    this.redirectTo("/");
  };
  async displayGame() {
    this.fetchedTracks = await fetchFromSpotify({
      endpoint: ["search"],
      token:
        // Update the token with your own Spotify API token
        "BQB1oc4wObXP0PZSOSuOfSwmR268v4xV5JO-8sLyLL1_m2JjknQnix_Ipx8Np0lkHOsOVsbp5CcwJErv24OQn3kyH_OSSG7BlKxvGB2bf8G6DzoH1tQ",
      params: {
        type: "track",
        q: this.getRandomSearch(),
        limit: 50,
        offset: this.getRandomOffsetNumber(),
      },
    });
    console.log("Fetched:", this.fetchedTracks.tracks.items);

    this.tracksArray = this.fetchedTracks.tracks.items;
    const uniqueArtists = Array.from(
      new Set(this.tracksArray.map((track) => track.artists[0].name))
    );

    console.log(uniqueArtists);
    this.tracksArray = this.tracksArray
      .filter(
        (track) =>
          track.artists && track.artists.length > 0 && track.artists[0].name
      )
      .slice(0, this.numberOfChoices);

    let artistNames = new Set<string>();
    let uniqueTracks: SpotifyTrack[] = [];

    console.log(
      "Artists names array after first filtering:",
      this.tracksArray.map((track) => track.artists[0].name)
    );
    for (let track of this.tracksArray) {
      const artistName = track.artists[0].name;
      if (!artistNames.has(artistName)) {
        uniqueTracks.push(track);
        artistNames.add(artistName);
      }

      if (uniqueTracks.length >= this.numberOfChoices) {
        break;
      }
    }

    this.tracksArray = uniqueTracks;

    this.currentTrack =
      this.tracksArray[Math.floor(Math.random() * this.numberOfChoices)];
    while (!this.currentTrack.preview_url) {
      this.currentTrack =
        this.tracksArray[Math.floor(Math.random() * this.numberOfChoices)];
    }
    console.log(this.tracksArray);
    console.log(this.currentTrack.artists[0].name);
    // Initialize Howler with the preview_url
    if (this.currentTrack.preview_url) {
      this.sound = new Howl({
        src: [this.currentTrack.preview_url],
        html5: true,
      });
    } else {
      console.log("No preview available for this track.");
    }
  }

  playPauseTrack = () => {
    if (this.sound) {
      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    }
  };

  pauseTrack = () => {
    if (this.sound) {
      if (this.sound.playing()) {
        this.sound.pause();
      }
    }
  };
  redirectTo(uri: string) {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([uri]);
    });
  }

  submitQuestion = () => {
    if (this.selectedTrack) {
      console.log("Selected track:", this.selectedTrack);
      if (this.sound) {
        if (this.sound.playing()) {
          this.sound.pause();
        }
      }
      this.gameProgressService.incrementRound();
      const currentDifficulty = this.sharedService.currentGameConfig.difficulty;
      if (
        this.currentTrack &&
        this.selectedTrack &&
        this.selectedTrack.artists[0].name === this.currentTrack.artists[0].name
      ) {
        console.log("Correct answer!");
        this.gameProgressService.incrementCorrectAnswers(currentDifficulty);
      } else {
        console.log("Incorrect answer!");
      }
      console.log("Current round:", this.gameProgressService.currentRound);
      console.log("Total rounds:", this.gameProgressService.totalRounds);
      console.log("Score from guessing game:", this.gameProgressService.points);
      if (
        this.gameProgressService.currentRound ===
        this.gameProgressService.totalRounds
      ) {
        console.log("Game over!");
        this.router.navigate(["/result"]);
      } else {
        this.redirectTo("/guessing-game");
      }
    } else {
      console.log("No track selected");
    }
  };
}
