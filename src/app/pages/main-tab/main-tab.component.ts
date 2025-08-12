import { Component } from '@angular/core';
import { TAB_PAGES } from 'src/app/constants/tab-pages';
import { TabBarService } from 'src/app/services/tab-bar.service';

@Component({
  selector: 'app-main-tab',
  templateUrl: './main-tab.component.html',
  styleUrls: ['./main-tab.component.scss'],
})
export class MainTabComponent {
  public readonly tabBarPages: any = TAB_PAGES.filter(
    (page: any) => page.inTabBar
  );
  public isTabBarVisible: boolean = true;

  constructor(
    private tabBarService: TabBarService
  ) { }

  public ngOnInit(): void {
    const pagesShowingTabBar: Set<string> = new Set<string>(
      TAB_PAGES.filter((page: any) => page.showTabBar).map(
        (page: any) => page.tab
      )
    );
    this.tabBarService.init(pagesShowingTabBar);
    this.tabBarService.tabBarVisibility.subscribe(isVisible => {
      this.isTabBarVisible = isVisible;
    });
  }
}
