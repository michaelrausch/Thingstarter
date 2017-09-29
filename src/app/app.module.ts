import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FlashMessagesModule } from 'angular2-flash-messages';

/*
 * Pages
 */
import { LandingPageComponent } from './components/pages/landing/landing.component';
import { ViewProjectPageComponent } from './components/pages/projects/view_project/view_project.component';
import { CreateProjectPageComponent } from './components/pages/projects/create_project/create_project.component';
import { ExplorePageComponent } from './components/pages/projects/explore_projects/explore_projects.component';
import { LoginPageComponent } from './components/pages/user/login/login.component';
import { SignupPageComponent } from './components/pages/user/signup/signup.component';

/*
 * Components
 */
import { MenuComponent } from './components/page_elements/menu/menu.component';
import { JumbotronComponent } from './components/page_elements/jumbotron/jumbotron.component';
import { FeaturedListComponent } from './components/projects/featured_list/featured_list.component';
import { ProjectComponent } from './components/projects/project/project.component';
import { ExploreCtaComponent } from './components/page_elements/explore_cta/explore_cta.component';
import { FooterComponent } from './components/page_elements/footer/footer.component';
import { MiniJumboComponent } from './components/page_elements/minijumbo/minijumbo.component';

import { AppComponent } from './app.component';

/*
 * Services 
 */
import { LoginService } from './services/login.service';

const appRoutes: Routes = [
  { path: '',
    component: LandingPageComponent
  },
  {
    path: 'explore',
    component: ExplorePageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'signup',
    component: SignupPageComponent
  },
  {
    path: 'startproject',
    component: CreateProjectPageComponent
  },
  {
    path: 'project',
    component: ViewProjectPageComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    JumbotronComponent,
    FeaturedListComponent,
    ProjectComponent,
    LandingPageComponent,
    ExploreCtaComponent,
    FooterComponent,
    ExplorePageComponent,
    MiniJumboComponent,
    LoginPageComponent,
    SignupPageComponent,
    CreateProjectPageComponent,
    ViewProjectPageComponent,
    SignupPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FlashMessagesModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
