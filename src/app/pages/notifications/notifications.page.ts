import { GlobalService } from './../../provider/global.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  items = [];
  constructor(public global: GlobalService) { }

  ngOnInit() {
    
    this.items = [
      {
        title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing',
        title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة',
        category_en: 'Business',
        category_ar: 'أعمال',
        time_en: '30 min afo',
        time_ar: 'منذ 30 دقيقة',
        details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
        details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة',
      },
      {
        title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing',
        title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة',
        category_en: 'Business',
        category_ar: 'أعمال',
        time_en: '30 min afo',
        time_ar: 'منذ 30 دقيقة',
        details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
        details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة',
      },
      {
        title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing',
        title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة',
        category_en: 'Business',
        category_ar: 'أعمال',
        time_en: '30 min afo',
        time_ar: 'منذ 30 دقيقة',
        details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
        details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة',
      },
      {
        title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing',
        title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة',
        category_en: 'Business',
        category_ar: 'أعمال',
        time_en: '30 min afo',
        time_ar: 'منذ 30 دقيقة',
        details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
        details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة',
      },
    ];
  }
  action(item) {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
  ionViewDidEnter(){
    this.global.selected = 4;
  }
}
