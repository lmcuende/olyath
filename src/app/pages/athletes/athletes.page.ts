import { DatabaseService, Ath } from './../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-athletes',
  templateUrl: './athletes.page.html',
  styleUrls: ['./athletes.page.scss'],
})
export class AthletesPage implements OnInit {

  athletes: Ath[] = [];
 
  results: Observable<any[]>;
 
  athlete = {};
  result = {};
 
  selectedView = 'aths';

  constructor(private db: DatabaseService) { }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getAths().subscribe(aths => {
          this.athletes = aths;
        })
        this.results = this.db.getResults();
      }
    });
  }

}
