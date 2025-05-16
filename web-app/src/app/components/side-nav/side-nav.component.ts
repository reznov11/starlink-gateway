import { Component, OnInit, ViewChild } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatIcon, MatIconRegistry} from '@angular/material/icon';
import {MatListItem, MatListItemIcon, MatNavList} from '@angular/material/list';
import {DomSanitizer} from '@angular/platform-browser';
import {NavItem} from './nav-items';
import {MainNavItemsList} from './data';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from '../header/header.component';
import { LayoutService } from '@app/services/sidebar-layout.service';
import {AuthService, UserProfile} from '@services/auth.service';
import {UserRole} from '@guards/role.guard';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterOutlet, MatSidenavContainer,
    MatSidenav, MatSidenavContent, MatIcon,
    MatNavList, MatListItem, RouterLink, MatIcon,
    MatListItemIcon, CommonModule, HeaderComponent,
    RouterLinkActive, MatCardModule, MatTooltipModule
  ],
  standalone: true,
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  public userProfile: UserProfile = {} as UserProfile;
  public sideNavItems: Array<NavItem[]> = [];

  constructor(
    public authService: AuthService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private layoutService: LayoutService,
    private router: Router
  ) {
    const footerNavItemsList: NavItem[] = [
      {
        title: 'Выйти',
        route: '/dashboard/profile',
        icon_name: 'custom_logout',
        icon_path: 'nav-icons/logout.svg',
        no_role: true
      },
    ];

    this.sideNavItems = [
      MainNavItemsList.map(item => ({ ...item})),
    ];

    const generalItems = MainNavItemsList.concat(footerNavItemsList);
  }

  ngOnInit() {
    this.userProfile = this.authService.currentUserProfile!;
  }

  ngAfterViewInit(): void {
    this.layoutService.setSidenav(this.sidenav);
  }

  public hasAllowedRoles(roles: UserRole[] | undefined): boolean {
    if (!roles || !this.userProfile?.role) return false;
    return roles.includes(this.userProfile?.role as UserRole);
  }

  public isRouteActive(routePath: string): boolean {
    return this.router.isActive(routePath, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

}
