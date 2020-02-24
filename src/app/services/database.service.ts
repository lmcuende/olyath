import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Ath {
  athlete_id: string,
  name: string,
  surname: string,
  date_of_birth: string,
  bio: string,
  height: number,
  weight: number,
  photo_id: any[]
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
 
  athletes = new BehaviorSubject([]);
  results = new BehaviorSubject([]);

  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'ocs_athletes.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    });
  }

  seedDatabase() {
    this.http.get('assets/ocs_athletes.db', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          this.loadAthletes();
          this.loadResults();
          this.dbReady.next(true);
        })
        .catch(e => console.error(e));
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }
 
  getAths(): Observable<Ath[]> {
    return this.athletes.asObservable();
  }
 
  getResults(): Observable<any[]> {
    return this.results.asObservable();
  }

  loadAthletes() {
    return this.database.executeSql('SELECT * FROM Athlete', []).then(data => {
      let athletes: Ath[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let results = [];
          if (data.rows.item(i).results != '') {
            results = JSON.parse(data.rows.item(i).results);
          }
 
          athletes.push({ 
            athlete_id: data.rows.item(i).athlete_id,
            name: data.rows.item(i).name,
            surname: data.rows.item(i).surname, 
            date_of_birth: data.rows.item(i).date_of_birth,
            bio: data.rows.item(i).bio,
            height: data.rows.item(i).heigh,
            weight: data.rows.item(i).weight,
            photo_id: data.rows.item(i).photo_id
           });
        }
      }
      this.athletes.next(athletes);
    });
  }

  addAthlete(name, surname, date_of_birth, bio, date_of_birth2, height, weight, photo_id) {
    let data = [name, surname, date_of_birth, bio, height, weight, photo_id];
    return this.database.executeSql('INSERT INTO Athlete (name, surname, date_of_birth, bio, height, weight, photo_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', data).then(data => {
      this.loadAthletes();
    });
  }

  getAthlete(athlete_id): Promise<Ath> {
    return this.database.executeSql('SELECT * FROM Athlete WHERE athlete_id = ?', [athlete_id]).then(data => {
      let results = [];
      if (data.rows.item(0).results != '') {
        results = JSON.parse(data.rows.item(0).results);
      }
 
      return {
        athlete_id: data.rows.item(0).id,
        name: data.rows.item(0).name,
        surname: data.rows.item(0).surname, 
        date_of_birth: data.rows.item(0).date_of_birth,
        bio: data.rows.item(0).bio,
        height: data.rows.item(0).heigh,
        weight: data.rows.item(0).weight,
        photo_id: data.rows.item(0).photo_id 
        
      }
    });
  }

  deleteAthlete(athlete_id) {
    return this.database.executeSql('DELETE FROM Athlete WHERE athlete_id = ?', [athlete_id]).then(_ => {
      this.loadAthletes();
      this.loadResults();
    });
  }

  updateAthlete(ath: Ath) {
    let data = [ath.name, ath.surname, ath.date_of_birth, ath.bio, ath.date_of_birth2, ath.height, ath.weight, ath.photo_id];
    return this.database.executeSql(`UPDATE Athlete SET name = ?, surname = ?, date_of_birth = ?, bio = ?, height = ?, weight = ?, photo_id = ? WHERE athlete_id = ${ath.athlete_id}`, data).then(data => {
      this.loadAthletes();
    })
  }

  loadResults() {
    let query = 'SELECT result.athlete_id, result.game_id, result.gold, result.silver, result.bronze AS creator FROM result JOIN Athlete ON athlete_id = result.creatorId';
    return this.database.executeSql(query, []).then(data => {
      let results = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          results.push({ 
            athlete_id: data.rows.item(i).athlete_id,
            game_id: data.rows.item(i).game_id,
            gold: data.rows.item(i).gold,
            silver: data.rows.item(i).silver,
            bronze: data.rows.item(i).bronze,
            creator: data.rows.item(i).creator,
           });
        }
      }
      this.results.next(results);
    });
  }

}
