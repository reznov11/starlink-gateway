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
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PreviewFormModalComponent } from './preview-form-modal/preview-form-modal.component';
import {FormElement, FormElementOption, PartnerForm} from '@pages/forms-constructor/create-form/models';
import {FormConstructor} from '@pages/forms-constructor/interfaces';
import {faker} from '@faker-js/faker';

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
  formId: string;
  formGroup: FormGroup;
  selectedElementId: string | null = null;

  isEditMode: boolean = false;
  selected: string = 'house';
  components_total: number = 0;

  formElements: FormElement[] = [
    {
      "id": "radio_1746740477460",
      "type": "radio",
      "label": "Радио",
      "description": "Выбор одного варианта",
      "icon": "radio_button_checked",
      "options": [
        {
          "id": "radio_option_1746740481281",
          "value": "Автокредит"
        },
        {
          "id": "radio_option_1746740485487",
          "value": "Автофинансирование по исламским принципам"
        }
      ],
      "isSelected": false,
      "newOptionValue": ""
    },
    {
      "id": "heading_1746740506202",
      "type": "heading",
      "label": "Заголовок",
      "description": "Добавьте заголовок для формы",
      "icon": "title",
      "isSelected": false,
      "value": "Ваше ФИО"
    },
    {
      "id": "textfield_1746740516100",
      "type": "textfield",
      "label": "Текстовое поле",
      "description": "Поле для ввода текста",
      "icon": "text_fields",
      "isSelected": false
    },
    {
      "id": "heading_1746740435846",
      "type": "heading",
      "label": "Заголовок",
      "description": "Добавьте заголовок для формы",
      "icon": "title",
      "isSelected": false,
      "value": "Номер телефона"
    },
    {
      "id": "phone_1746740456292",
      "type": "phone",
      "label": "Номер телефона",
      "description": "Поле для ввода номера телефона",
      "icon": "phone",
      "isSelected": false
    },
    {
      "id": "heading_1746740294081",
      "type": "heading",
      "label": "Заголовок",
      "description": "Добавьте заголовок для формы",
      "icon": "title",
      "isSelected": false,
      "value": "Стоимость авто, сом"
    },
    {
      "id": "textfield_1746740345123",
      "type": "textfield",
      "label": "Текстовое поле",
      "description": "Поле для ввода текста",
      "icon": "text_fields",
      "isSelected": false
    },
    {
      "id": "heading_1746740296667",
      "type": "heading",
      "label": "Заголовок",
      "description": "Добавьте заголовок для формы",
      "icon": "title",
      "isSelected": false,
      "value": "Первоначальный взнос, сом"
    },
    {
      "id": "textfield_1746740351565",
      "type": "textfield",
      "label": "Текстовое поле",
      "description": "Поле для ввода текста",
      "icon": "text_fields",
      "isSelected": false
    },
    {
      "id": "heading_1746740309311",
      "type": "heading",
      "label": "Заголовок",
      "description": "Добавьте заголовок для формы",
      "icon": "title",
      "isSelected": false,
      "value": "Срок кредита"
    },
    {
      "id": "dropdown_1746740359927",
      "type": "dropdown",
      "label": "Выпадающий список",
      "description": "Выберите из списка",
      "icon": "arrow_drop_down_circle",
      "options": [
        {
          "id": "dropdown_option_1746740362754",
          "value": "1"
        },
        {
          "id": "dropdown_option_1746740364287",
          "value": "2"
        },
        {
          "id": "dropdown_option_1746740365447",
          "value": "4"
        }
      ],
      "isSelected": false,
      "newOptionValue": ""
    },
    {
      "id": "heading_1746740317340",
      "type": "heading",
      "label": "Заголовок",
      "description": "Добавьте заголовок для формы",
      "icon": "title",
      "isSelected": false,
      "value": "Ежемесячный платеж"
    },
    {
      "id": "paragraph_1746740321275",
      "type": "paragraph",
      "label": "Подзаголовок",
      "description": "Добавьте описательный текст",
      "icon": "subject",
      "isSelected": false,
      "value": "43 550 сом"
    },
    {
      "id": "info_1746740380227",
      "type": "info",
      "label": "Текстовый блок",
      "description": "Информационный текст",
      "icon": "info",
      "isSelected": false,
      "value": "Оставьте заявку и с вами свяжется специалист и ответит на все интересующие вас вопросы и подберет самые лучшие условия"
    },
    {
      "id": "checkbox_1746740556792",
      "type": "checkbox",
      "label": "Чекбокс",
      "description": "Выбор нескольких вариантов",
      "icon": "check_box",
      "options": [
        {
          "id": "checkbox_option_1746740561715",
          "value": "Я даю свое согласие на передачу моего ФИО и номера телефона ОАО \"Бакай Банк\" в целях обратной связи по вопросам кредитования."
        }
      ],
      "isSelected": false,
      "newOptionValue": ""
    }
  ];
  availableElements: FormElement[] = [
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
    private currentRouter: ActivatedRoute
  ) {
    this.formId = this.currentRouter.snapshot.params['formId'];
    this.formGroup = this.fb.group({
      title: ['' , [Validators.required]],
      partner: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.formId){
      this.isEditMode = true;
      this.formElements = this.formElements.map(element => ({
        ...element,
        isSelected: element.id === this.formId
      }));
    };

    this.components_total = this.formElements.length;
  }

  onDrop(event: CdkDragDrop<FormElement[]>): void {
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

  getDefaultOptions(type: string): FormElementOption[] | undefined {
    if (type === 'radio' || type === 'checkbox' || type === 'dropdown') {
      return [];
    }
    return undefined;
  }

  addOption(element: FormElement): void {
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

  removeOption(element: FormElement, optionId: string): void {
    if (element.options) {
      element.options = element.options.filter(opt => opt.id !== optionId);
    }
  }

  selectElement(elementId: string): void {
    this.formElements = this.formElements.map(element => ({
      ...element,
      isSelected: element.id === elementId
    }));
    this.selectedElementId = elementId;
  }

  onPreview(): void {
    this.dialog.open(PreviewFormModalComponent, {
      width: '600px',
      data: {
        formElements: this.formElements,
        title: this.formGroup.get('title')?.value || ''
      }
    });
  }

  onSave(): void {
    if (this.formGroup.valid) {
      const formData: FormConstructor = {
        id: faker.string.uuid(),
        title: this.formGroup.get('title')?.value,
        partner: this.formGroup.get('partner')?.value,
        user: {id: faker.string.uuid()},
        components: this.formElements
      };
      console.log('Save form:', formData);
    }
  }

  onCancel(): void {
    this.formElements = [];
    this.formGroup.reset();

    this.router.navigate(['/dashboard/forms-constructor']);
  }

  removeElement(index: number): void {
    this.formElements.splice(index, 1);
  }

  onFileSelected(event: Event, element: FormElement): void {
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

  triggerFileInput(element: FormElement): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = element.type === 'image' ? 'image/*' : 'video/*';
    input.style.display = 'none';

    input.onchange = (e) => this.onFileSelected(e, element);
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  setDefaultOption(element: FormElement, optionId: string): void {
    if (element.defaultValue === optionId) {
      element.defaultValue = undefined;
    } else {
      element.defaultValue = optionId;
      element.value = optionId;
    }
  }
}
