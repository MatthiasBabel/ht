import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { BuchenComponent } from './buchen/buchen.component';
import { AccountsComponent } from './accounts/accounts.component';



@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule
  ],
  declarations: [
    HomeComponent,
    PagesComponent,
    BuchenComponent,
    AccountsComponent,
  ]
})
export class PagesModule { }
