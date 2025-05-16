import { Component, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderService } from '@app/services/loader.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    imports: [
        MatProgressBarModule,
    ]
})
export class LoaderComponent implements OnInit {
    loading: boolean = false;

    constructor(private loaderService: LoaderService) {
        this.loaderService.isLoading.subscribe((v: boolean) => {
            this.loading = v;
        });
    }

    ngOnInit() { }
}
