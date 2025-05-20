import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartnerService } from '@app/services/api/partner';
import { HttpResponse } from '@angular/common/http';
import { FormConstructor } from '@app/pages/forms-constructor/interfaces';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormElement } from '@app/pages/forms-constructor/create-form/models';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ]
})
export class PortalComponent implements OnInit {
    isLoading: boolean = false;
    domainCode: string | null = null;
    portalData: FormConstructor | null = null;
    formGroup: FormGroup = new FormGroup({});

    constructor(
        private activatedRoute: ActivatedRoute,
        private partnerService: PartnerService
    ) { }

    async ngOnInit(): Promise<void> {
        this.isLoading = true;
        this.activatedRoute.queryParams.subscribe(async (params: any) => {
            if (!params['ifr_code']) {
                throw new Error('Неверный код домена');
            } else {
                this.domainCode = params['ifr_code'];
                await this.getPartnerForm();
            }
        });
    }

    async getPartnerForm(): Promise<void> {
        (await this.partnerService.getPartnerByDomainCode(this.domainCode!)).subscribe({
            next: (response: HttpResponse<FormConstructor>) => {
                console.log('Response:', response.status);
                if (response.status === 202) {
                    this.portalData = response.body;
                    this.formGroup = new FormGroup(
                        this.portalData!.components!.reduce((acc, component: FormElement) => ({
                            ...acc,
                            [component.id]: new FormControl(component.value)
                        }), {})
                    );
                }
            },
            error: (error: any) => {
                throw error;
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    onSubmit(): void {
        console.log('Submit', this.formGroup.value);
    }
}
