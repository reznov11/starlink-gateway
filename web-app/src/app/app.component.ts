import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
// import { environment } from './environments/environment';
import { ProgressService } from './services/progress-bar.service';
import { Logger } from './services/logger.service';
import { HttpClient } from '@angular/common/http';

const log = new Logger('App');

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'web-app';

  constructor(
    public progService: ProgressService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    log.debug('init');
  }
}
