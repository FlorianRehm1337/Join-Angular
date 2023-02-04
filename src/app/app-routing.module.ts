import { NgModule } from '@angular/core';
import { CanActivate,RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SummaryComponent } from './summary/summary.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { HelpComponent } from './help/help.component';
import { ContactsComponent } from './contacts/contacts.component';
import { BoardComponent } from './board/board.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { AddContactDialogComponent } from './add-contact-dialog/add-contact-dialog.component';
import { EditContactDialogComponent } from './edit-contact-dialog/edit-contact-dialog.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'summary', component: SummaryComponent, canActivate: [AuthGuardService] },
  { path: 'addtask', component: AddTaskComponent, canActivate: [AuthGuardService] },
  { path: 'legal-notice', component: LegalNoticeComponent, canActivate: [AuthGuardService] },
  { path: 'help', component: HelpComponent, canActivate: [AuthGuardService] },
  { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuardService] },
  { path: 'board', component: BoardComponent, canActivate: [AuthGuardService] },
  { path: 'add-contact', component: AddContactDialogComponent },
  { path: 'edit-contact', component: EditContactDialogComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
