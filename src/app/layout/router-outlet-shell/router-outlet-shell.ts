import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'router-outlet-shell',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class RouterOutletShell {

}