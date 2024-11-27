import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from './home/home.component';
import { GuessingGameComponent } from './guessing-game/guessing-game.component';
import { ResultComponent } from './result/result.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { RulesComponent } from './rules/rules.component';
import { ButtonComponent } from './button/button.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "guessing-game", component: GuessingGameComponent },
  { path: "result", component: ResultComponent },
  { path: "leaderboard", component: LeaderboardComponent },
  { path: "configuration", component: ConfigurationComponent },
  { path: "rules", component: RulesComponent }
];


@NgModule({
  declarations: [AppComponent, HomeComponent, GuessingGameComponent, ResultComponent, LeaderboardComponent, ConfigurationComponent, RulesComponent, ButtonComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes), RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {}
