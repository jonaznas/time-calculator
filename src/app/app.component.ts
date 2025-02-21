import { Component, OnInit } from "@angular/core";
import { Time } from "src/app/time";
import { DateTime } from "luxon";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "app-root",
  imports: [
    DecimalPipe
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css"
})
export class AppComponent implements OnInit {
  times: Time[] = [];
  totalTime: number = 0;

  ngOnInit() {
    this.times.push({id: this.getNewId()});
  }

  updateStartTime(id: number, event: Event) {
    const element = event.target as HTMLInputElement;
    const index = this.times.findIndex(time => time.id === id);
    this.times[index].start = DateTime.fromISO(element.value);
    this.removeEmptyRows();
    this.updateTotalTime();
  }

  updateEndTime(id: number, event: Event) {
    const element = event.target as HTMLInputElement;
    const index = this.times.findIndex(time => time.id === id);
    this.times[index].end = DateTime.fromISO(element.value);
    this.removeEmptyRows();
    this.updateTotalTime();
  }

  removeEmptyRows() {
    this.times = this.times.filter(time => time.start || time.end);
    if (this.times.length === 0) {
      this.times.push({id: this.getNewId()});
    }
  }

  addRow() {
    this.times.push({id: this.getNewId()});
  }

  removeTime(id: number) {
    if (this.times.length === 1) {
      return;
    }
    this.times = this.times.filter(time => time.id !== id);
  }

  getNewId() {
    return new Date().getTime();
  }

  updateTotalTime() {
    this.totalTime = this.times.reduce((acc, time) => {
      if (time.start && time.end) {
        return acc + time.end.diff(time.start, "hours").hours;
      } else {
        return acc;
      }
    }, 0);
  }

  copyFriendlyString() {
    this.removeEmptyRows();
    const timeStrings = this.times.map(time => {
      if (time.start && time.end) {
        return `${time.start.toFormat("HH:mm")} - ${time.end.toFormat("HH:mm")}`;
      } else {
        return "";
      }
    });
    const friendlyString = timeStrings.join("\n");
    navigator.clipboard.writeText(friendlyString).then(r => {
      console.log("Copied to clipboard: " + friendlyString);
    });
  }
}
