import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PreviewFormModalComponent } from './preview-form-modal/preview-form-modal.component';
import { FormElement, FormElementOption } from '@pages/forms-constructor/create-form/models';
import { FormConstructor, FormSettings, Partner } from '@pages/forms-constructor/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormService } from '@app/services/api/form';
import { PartnerService } from '@app/services/api/partner';
import { FormSettingsModalComponent } from './form-settings-modal/form-settings-modal.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    DragDropModule,
    MatCardModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule
  ]
})
export class CreateFormComponent implements OnInit {
  private formId: string;
  public formGroup: FormGroup;
  public isLoading: boolean = false;
  public selectedElementId: string | null = null;

  public isEditMode: boolean = false;
  public components_total: number = 0;
  public partners: Partner[] = [];
  public formSettings: FormSettings = {
    type: 'button',
    button: {
      background: '#4B82EC',
      text: 'Бакай банк',
      size: 'sm',
      textColor: '#FFFFFF',
      fontSize: 'sm',
      hasShadow: false,
      isRounded: false
    }
  } as FormSettings;

  public formElements: FormElement[] = [];
  public readonly availableElements: FormElement[] = [
    {
      id: 'heading',
      type: 'heading',
      label: 'Заголовок',
      description: 'Добавьте заголовок для формы',
      icon: 'title'
    },
    {
      id: 'paragraph',
      type: 'paragraph',
      label: 'Подзаголовок',
      description: 'Добавьте описательный текст',
      icon: 'subject'
    },
    {
      id: 'textfield',
      type: 'textfield',
      label: 'Текстовое поле',
      description: 'Поле для ввода текста',
      icon: 'text_fields'
    },
    {
      id: 'info',
      type: 'info',
      label: 'Текстовый блок',
      description: 'Информационный текст',
      icon: 'info'
    },
    {
      id: 'phone',
      type: 'phone',
      label: 'Номер телефона',
      description: 'Поле для ввода номера телефона',
      icon: 'phone'
    },
    {
      id: 'dropdown',
      type: 'dropdown',
      label: 'Выпадающий список',
      description: 'Выберите из списка',
      icon: 'arrow_drop_down_circle'
    },
    {
      id: 'radio',
      type: 'radio',
      label: 'Радио',
      description: 'Выбор одного варианта',
      icon: 'radio_button_checked'
    },
    {
      id: 'checkbox',
      type: 'checkbox',
      label: 'Чекбокс',
      description: 'Выбор нескольких вариантов',
      icon: 'check_box'
    },
    {
      id: 'image',
      type: 'image',
      label: 'Картинка',
      description: 'Добавить изображение',
      icon: 'image'
    },
    {
      id: 'video',
      type: 'video',
      label: 'Видео',
      description: 'Добавить видео',
      icon: 'videocam'
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private currentRouter: ActivatedRoute,
    private formService: FormService,
    private snackBar: MatSnackBar,
    private partnerService: PartnerService
  ) {
    this.formId = this.currentRouter.snapshot.params['formId'];
    this.formGroup = this.fb.group({
      title: ['', [Validators.required]],
      partner: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    await this.getPartners();

    if (this.formId) {
      await this.getForm();
    };
  }

  private async getForm(): Promise<void> {
    this.isLoading = true;
    (await this.formService.getFormById(this.formId))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((form: FormConstructor) => {
        this.isEditMode = true;

      this.formElements = form.components || [];

      this.formGroup.patchValue({
        title: form.title,
        partner: form.partner,
      });

      this.formSettings = form.settings || this.formSettings;
      this.components_total = form.components_total || 0;
    })
  }

  private async getPartners(): Promise<void> {
    (await this.partnerService.getPartners()).subscribe((partners: Partner[]) => {
      this.partners = partners;
    });
  }

  public async onSave(): Promise<void> {
    if (this.formGroup.valid) {
      const formData: FormConstructor = {
        title: this.formGroup.get('title')?.value,
        partner: this.formGroup.get('partner')?.value,
        components: this.formElements,
        components_total: this.formElements.length,
        settings: this.formSettings
      } as FormConstructor;

      let form = await this.formService.createForm(formData);

      if (this.isEditMode) {
        form = await this.formService.updateForm(this.formId, formData);
      }

      form.subscribe(({
        next: () => {
          this.router.navigate(['/dashboard/forms-constructor']).then(() => {
            this.snackBar.open('Форма создана', 'Закрыть', {
              duration: 3000,
              verticalPosition: 'top',
            });
          });
        },
        error: (error: any) => {
          console.error(error);
          this.snackBar.open('Ошибка при создании формы', 'Закрыть', {
            duration: 3000,
            verticalPosition: 'top',
          });
        }
      }));
    }
  }

  public onDrop(event: CdkDragDrop<FormElement[]>): void {
    console.log('Event', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {

      const draggedElement = {
        ...event.item.data,
        id: `${event.item.data.type}_${Date.now()}`,
        options: this.getDefaultOptions(event.item.data.type),
        isSelected: false
      };

      if (event.container.data === this.formElements) {
        if (event.currentIndex >= this.formElements.length) {
          this.formElements.push(draggedElement);
        } else {
          this.formElements.splice(event.currentIndex, 0, draggedElement);
        }
      }
    }
  }

  private getDefaultOptions(type: string): FormElementOption[] | undefined {
    if (type === 'radio' || type === 'checkbox' || type === 'dropdown') {
      return [];
    }
    return undefined;
  }

  public addOption(element: FormElement): void {
    if (!element.newOptionValue?.trim()) return;

    if (!element.options) {
      element.options = [];
    }

    element.options.push(<FormElementOption>{
      id: `${element.type}_option_${Date.now()}`,
      value: element.newOptionValue?.trim()
    });

    element.newOptionValue = '';
  }

  public removeOption(element: FormElement, optionId: string): void {
    if (element.options) {
      element.options = element.options.filter(opt => opt.id !== optionId);
    }
  }

  public selectElement(elementId: string): void {
    this.formElements = this.formElements.map(element => ({
      ...element,
      isSelected: element.id === elementId
    }));
    this.selectedElementId = elementId;
  }

  public onPreview(): void {
    this.dialog.open(PreviewFormModalComponent, {
      width: '600px',
      data: {
        formElements: this.formElements,
        title: this.formGroup.get('title')?.value || ''
      }
    });
  }

  public onCancel(): void {
    this.formElements = [];
    this.formGroup.reset();

    this.router.navigate(['/dashboard/forms-constructor']);
  }

  public removeElement(index: number): void {
    this.formElements.splice(index, 1);
  }

  public onFileSelected(event: Event, element: FormElement): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (element.type === 'image' && !file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (element.type === 'video' && !file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }

      element.value = URL.createObjectURL(file);
      element.file = file;
    }
  }

  public triggerFileInput(element: FormElement): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = element.type === 'image' ? 'image/*' : 'video/*';
    input.style.display = 'none';

    input.onchange = (e) => this.onFileSelected(e, element);
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  public setDefaultOption(element: FormElement, optionId: string): void {
    if (element.defaultValue === optionId) {
      element.defaultValue = undefined;
    } else {
      element.defaultValue = optionId;
      element.value = optionId;
    }
  }

  public openFormSettings(): void {
    const dialogRef = this.dialog.open(FormSettingsModalComponent, {
      maxWidth: '1200px',
      data: {
        settings: this.formSettings,
        formElements: this.formElements
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.formSettings = result;
      }
    });
  }
}
