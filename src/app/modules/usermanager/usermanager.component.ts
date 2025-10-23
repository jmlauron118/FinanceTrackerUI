import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './partials/users/users.component';
import { RolesComponent } from './partials/roles/roles.component';
import { ModulesComponent } from './partials/modules/modules.component';
import { ActionsComponent } from './partials/actions/actions.component';
import { ModuleActionsComponent } from './partials/module-actions/module-actions.component';
import { UserRolesComponent } from './partials/user-roles/user-roles.component';
import { ModuleAccessComponent } from './partials/module-access/module-access.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-usermanager',
  templateUrl: './usermanager.component.html',
  styleUrls: ['./usermanager.component.scss'],
  imports: [CommonModule, UsersComponent, RolesComponent, ModulesComponent, ActionsComponent, ModuleActionsComponent, UserRolesComponent, ModuleAccessComponent, MatButtonModule],
})
export class UserManagerComponent {
  @ViewChild(UsersComponent) usersComponent!: UsersComponent;
  @ViewChild(RolesComponent) rolesComponent!: RolesComponent;
  @ViewChild(ModulesComponent) modulesComponent!: ModulesComponent;
  @ViewChild(ActionsComponent) actionComponent!: ActionsComponent;
  @ViewChild(ModuleActionsComponent) moduleActionComponent!: ModuleActionsComponent;

  title = 'User Manager';
  activeTab = 'users';
  showTab = 'users';

  setActiveTab(tab: string) {
    this.activeTab = tab;

    setTimeout(() => {
      this.showTab = tab;
      this.loadData(this.activeTab);
    }, 200); 

  }

  isActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  isShown (tab: string): boolean {
    return this.showTab === tab;
  }

  loadData(tab: string): void {
    if(tab==='users'){
      this.usersComponent.getAllUsers();
    }
    else if(tab === 'roles') {
      this.rolesComponent.getAllRoles();
    }
    else if(tab === 'modules') {
      this.modulesComponent.getAllModules();
    }
    else if(tab === 'actions') {
      this.actionComponent.getAllActions();
    }
    else if (tab === 'module-actions') {
      this.moduleActionComponent.getAllModuleActions();
    }
  }
}
