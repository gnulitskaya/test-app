import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, concatMap, interval, map, mapTo, of, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { HttpServiceService } from '../../services/http-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  private _destroy$: Subject<void> = new Subject<void>();
  private readonly _countDown: number = 60;
  @ViewChild('snackbar') customSnackbar: any;
  interval$$: Observable<number> = interval(1000);
  secondsLeftToSendAgain$$: BehaviorSubject<number> = new BehaviorSubject(0);

  public statusMessage: string = '';
  public isButtonDisabled: boolean = false;
  
  public form: FormGroup = new FormGroup({
    login: new FormControl(null, [Validators.required]),
  });

  constructor(private _baseHttpService: HttpServiceService) {}

  ngOnInit(): void {}

  onClickSend() {
    this.getResults().pipe(
      takeUntil(this._destroy$)
    )
    .subscribe();
  }

  private getResults(): Observable<any> {
    this.isButtonDisabled = true;
    
    return this._baseHttpService
      .post(`posts`, {
        title: this.form.controls['login'].value
      })
      .pipe(
        tap((resp: any) => {
          console.log("resp", resp);
          this.statusMessage = resp.title;
          this._initCountdown();
        }),
        catchError((error: any) => {
          console.log('error');
          this.customSnackbar.open('Ошибка при загрузке данных', 'error');
          this._initCountdown();
          return of(error);
        }),
        map((response) => response)
      );
  }

  private _initCountdown(): void {
    this._createCountDownTimer$$()
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe();
  }

  private _createCountDownTimer$$(): Observable<void> {
    return this.interval$$
      .pipe(
        map((timeElapsed: number): number => this._countDown - timeElapsed),
        takeWhile((timeLeft: number): boolean => timeLeft >= 0),
        tap((timeLeft: number) => {
          this.secondsLeftToSendAgain$$.next(timeLeft);
          if (timeLeft === 0) {
            this.isButtonDisabled = false;
          }
        }),
        mapTo(void 0)
      );
  }
}
