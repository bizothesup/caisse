import { GlobalService } from './../../provider/global.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-likes',
    templateUrl: './likes.page.html',
    styleUrls: ['./likes.page.scss'],
})
export class LikesPage implements OnInit {
    top_news = [];
    constructor(public global: GlobalService) {

    }

    ngOnInit() {
        this.top_news = [

            { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/001.png', like: '100', dislike: '20' },

            { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/002.png', like: '100', dislike: '20' },

            { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/001.png', like: '100', dislike: '20' },

            { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/002.png', like: '100', dislike: '20' },

            { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/001.png', like: '100', dislike: '20' },

            { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/002.png', like: '100', dislike: '20' },

            { title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing ', title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة', category_en: 'Business', category_ar: 'أعمال', details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy', details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. كان لوريم إيبسوم الدمية القياسية لهذه الصناعة', time_en: '30 min ago', time_ar: 'منذ 30 دقيقة', img: 'assets/imgs/001.png', like: '100', dislike: '20' },
        ];

        for (let i = 0; i < this.top_news.length; i++) {
            this.top_news[i].liked = true;
        }
    }

    dislike(item) {
        event.preventDefault();
        event.stopPropagation();
        if (item.liked === true) {
            item.liked = false;
            this.removeItem(item);
        }
    }
    removeItem(item) {
        const index = this.top_news.indexOf(item);
        // let index = this.top_news.findIndex(obj => obj === this.top_news);
        if (index > -1) {
            this.top_news.splice(index, 1);
        }
    }


}
