import {FormElement, FormInputName} from '@pages/forms-constructor/create-form/models';

export const availableElements: FormElement[] = [
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
  {
    id: 'hidden',
    type: 'hidden',
    label: 'Невидимое поле',
    description: 'Поле не отображается в форме (например: значение категории или подкатегории)',
    icon: 'visibility_off'
  },
];
export const inputNames: FormInputName[] = [
  {id: 'fullName', name: 'ФИО'},
  {id: 'phone', name: 'Номер телефона'},
  {id: 'email', name: 'Почта'},
  {id: 'title', name: 'Название продукта'},
  {id: 'cbsId', name: 'АБС ID'},
  {id: 'category', name: 'ID Категория/Подкатегория'},
  {id: 'type', name: 'Тип кредита/депозита'},
  {id: 'currency', name: 'Валюта'},
  {id: 'amount', name: 'Сумма кредита/депозита'},
  {id: 'initialPayment', name: 'Первоначальный взнос'},
  {id: 'price', name: 'Стоимость автомобиля/Квартира'},
  {id: 'branchId', name: 'Филиал'},
  {id: 'description', name: 'Описание'},
  {id: 'term', name: 'Срок кредита/депозита в месяцах'},
  {id: 'consentToUsePersonalData', name: 'Согласие на обработку персональных данных'},
];
