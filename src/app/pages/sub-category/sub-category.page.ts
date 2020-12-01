import { GlobalService } from './../../provider/global.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.page.html',
  styleUrls: ['./sub-category.page.scss'],
})
export class SubCategoryPage implements OnInit {
  title: String;
  top_news = [];
  constructor(private router: ActivatedRoute, public global: GlobalService) { }


  ngOnInit() {
    this.title = this.router.snapshot.paramMap.get('title');
    this.top_news = [
      { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/001.png', like: '100', dislike: '20' },
      { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/002.png', like: '100', dislike: '20' },
      { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/001.png', like: '100', dislike: '20' },
      { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/002.png', like: '100', dislike: '20' },
      { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/001.png', like: '100', dislike: '20' },
      { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/002.png', like: '100', dislike: '20' },
      { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/001.png', like: '100', dislike: '20' },
    ];
  }

  like(item) {
    event.preventDefault();
    event.stopPropagation();
    item.liked = (item.liked !== true) ? true : false;
    if (item.liked === true) {
      item.disLiked = false;
    }
  }
  dislike(item) {
    event.preventDefault();
    event.stopPropagation();
    item.disLiked = (item.disLiked !== true) ? true : false;
    if (item.disLiked === true) {
      item.liked = false;
    }
  }
}
