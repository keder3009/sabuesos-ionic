import { Injectable } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabBarService {
  private tabBarTabs: Set<string>;
  public tabBarVisibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setTabVisibility(event);
      });
  }

  public init(tabBarTabs: Set<string>): void {
    this.tabBarTabs = tabBarTabs;
    
  }

  private setTabVisibility(event: NavigationEnd) {
    const lastUrlPart: string = event.urlAfterRedirects.split('/').pop() || '';
    if (this.tabBarTabs.has(lastUrlPart)) {
      this.tabBarVisibility.next(true);
    } else {
      this.tabBarVisibility.next(false);
    }
  }
}
