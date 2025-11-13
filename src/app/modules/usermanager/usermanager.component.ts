import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './partials/users/users.component';
import { RolesComponent } from './partials/roles/roles.component';
import { ModulesComponent } from './partials/modules/modules.component';
import { ActionsComponent } from './partials/actions/actions.component';
import { ModuleActionsComponent } from './partials/module-actions/module-actions.component';
import { UserRolesComponent } from './partials/user-roles/user-roles.component';
import { ModuleAccessComponent } from './partials/module-access/module-access.component';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-usermanager',
  templateUrl: './usermanager.component.html',
  styleUrls: ['./usermanager.component.scss'],
  imports: [CommonModule, UsersComponent, RolesComponent, ModulesComponent, ActionsComponent, ModuleActionsComponent, UserRolesComponent, ModuleAccessComponent, MatButtonModule],
  encapsulation: ViewEncapsulation.None
})
export class UserManagerComponent {
  @ViewChild(UsersComponent) usersComponent!: UsersComponent;
  @ViewChild(RolesComponent) rolesComponent!: RolesComponent;
  @ViewChild(ModulesComponent) modulesComponent!: ModulesComponent;
  @ViewChild(ActionsComponent) actionComponent!: ActionsComponent;
  @ViewChild(ModuleActionsComponent) moduleActionComponent!: ModuleActionsComponent;
  @ViewChild(UserRolesComponent) userRoleComponent!: UserRolesComponent;
  @ViewChild(ModuleAccessComponent) moduleAccessComponent!: ModuleAccessComponent;

  constructor(
    private snackbar: SnackbarService
  ) {}

  title = 'User Manager';
  activeTab = 'users';
  showTab = 'users';

  setActiveTab(tab: string) {
    this.activeTab = tab;

    setTimeout(() => {
      this.showTab = tab;
      this.onTabChange(this.showTab);
    }, 200); 
  }

  isActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  isShown (tab: string): boolean {
    return this.showTab === tab;
  }

  onTabChange(tab: string): void {
    const tabActions: Record<string, () => void> = {
      'users': () => this.usersComponent.getAllUsers(),
      'roles': () => this.rolesComponent.getAllRoles(),
      'modules': () => this.modulesComponent.getAllModules(),
      'actions': () => this.actionComponent.getAllActions(),
      'module-actions': () => this.moduleActionComponent.getAllModuleActions(),
      'user-roles': () => this.userRoleComponent.getAllUserRoles(),
      'module-access': () => this.moduleAccessComponent.getAllModuleAccess()
    };

    tabActions[tab] ? tabActions[tab]() : this.snackbar.warning(`Unknown tab: ${tab}`);
  }
}
