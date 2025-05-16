import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteTitleService {
  private titleSubject = new BehaviorSubject<string>('Страница');
  public title$ = this.titleSubject.asObservable();

  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  initialize(): void {
    this.setTitleFromRoute(this.activatedRoute);

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.activatedRoute.root)
    ).subscribe(route => {
      this.setTitleFromRoute(route);
    });
  }

  public setTitleFromRoute(route: ActivatedRoute): void {
    const title = this.getTitle(route) || 'Страница';
    this.titleService.setTitle(title);
    this.titleSubject.next(title);
  }

  private getTitle(route: ActivatedRoute): string | null {
    if (route.snapshot.data && route.snapshot.data['title']) {
      return route.snapshot.data['title'];
    }

    if (route.firstChild) {
      return this.getTitle(route.firstChild);
    }

    return null;
  }
}