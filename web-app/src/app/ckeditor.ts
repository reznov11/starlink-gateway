import ClassicEditorBase from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ru';
import '@ckeditor/ckeditor5-build-classic/build/translations/en-gb';

export class CKEditorConfig extends ClassicEditorBase {
  static override defaultConfig = {
    language: 'ru',
    placeholder: 'Введите текст...',
    toolbar: {
      items: [
        'heading', '|',
        'bold', 'italic', 'link', '|',
        'bulletedList', 'numberedList', '|',
        'alignment', 'indent', 'outdent', '|',
        'undo', 'redo'
      ]
    },
    image: {
      toolbar: []
    },
    table: {
      contentToolbar: []
    },
    removePlugins: [
      'CKFinderUploadAdapter', 'CKFinder', 'EasyImage',
      'Image', 'ImageCaption', 'ImageStyle',
      'ImageToolbar', 'ImageUpload', 'MediaEmbed'
    ]
  };
}
