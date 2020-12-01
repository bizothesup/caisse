import { ActionSheetController } from '@ionic/angular';
import { GlobalService } from './../../provider/global.service';
import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  liked: boolean;
  disLiked: boolean;
  details = {};
  comments = [];
  text = 'NOW, You can test our themes directly on your mobile';
  app_link = 'https://play.google.com/store/apps/details?id=hybapps.hybapps.com';
  hybapps_img = 'https://www.hybapps.com/themes_market/files/small/0549e4434b8f78a73c12bd3be3f4d630.png';

  video = 'https://static.videezy.com/system/resources/previews/000/000/360/original/MAH00003.mp4';
  video_case;

  constructor(public actionSheetCtrl: ActionSheetController, private router: ActivatedRoute, public global: GlobalService, private socialSharing: SocialSharing) { }

  ngOnInit() {

    this.video_case = this.router.snapshot.paramMap.get('video');
    console.log(this.video_case)
    this.details = {
      title_en: 'Our World : Lorem Ipsum is simply dummy text of the printing',
      title_ar: 'عالمنا: لوريم إيبسوم هو ببساطة نص زائف للطباعة',

      details_en: ' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',

      details_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. لقد كان لوريم إيبسوم النص القياسي المعياري لهذه الصناعة منذ القرن السادس عشر ، عندما أخذت طابعة غير معلومة مجموعة من الأطباق وهرعت بها لعمل كتاب من نوع العينة. وقد نجا ليس فقط خمسة قرون ، ولكن أيضا قفزة في التنضيد الإلكتروني ، وتبقى في الأساس دون تغيير. وقد حظيت بشهرة واسعة في الستينيات من القرن الماضي هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. لقد كان لوريم إيبسوم النص القياسي المعياري لهذه الصناعة منذ القرن السادس عشر ، عندما أخذت طابعة غير معلومة مجموعة من الأطباق وهرعت بها لعمل كتاب من نوع العينة. وقد نجا ليس فقط خمسة قرون ، ولكن أيضا قفزة في التنضيد الإلكتروني ، وتبقى في الأساس دون تغيير. وقد حظيت بشهرة واسعة في الستينيات من القرن الماضي هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. لقد كان لوريم إيبسوم النص القياسي المعياري لهذه الصناعة منذ القرن السادس عشر ، عندما أخذت طابعة غير معلومة مجموعة من الأطباق وهرعت بها لعمل كتاب من نوع العينة. وقد نجا ليس فقط خمسة قرون ، ولكن أيضا قفزة في التنضيد الإلكتروني ، وتبقى في الأساس دون تغيير. وقد حظيت بشهرة واسعة في الستينيات من القرن الماضي',
      category_en: 'Business',
      category_ar: 'أعمال',
      time_en: '30 min ago',
      time_ar: 'منذ 30 دقيقة'
    };
    this.comments = [
      {
        img: 'assets/imgs/profile.png',
        name_en: 'John Smith',
        name_ar: 'جون سميث',

        comment_en: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',

        comment_ar: 'هو ببساطة النص الوهمي لصناعة الطباعة والتنضيد. لوريم إيبسوم (Lorem Ipsum) كان النص القياسي المعياري لهذه الصناعة منذ القرن السادس عشر',
        time_en: '30 min ago',
        time_ar: 'منذ 30 دقيقة'
      }
    ]
  }
  like() {
    this.liked = (this.liked !== true) ? true : false;
    if (this.liked === true) {
      this.disLiked = false;
    }
  }
  dislike() {
    this.disLiked = (this.disLiked !== true) ? true : false;
    if (this.disLiked === true) {
      this.liked = false;
    }
  }
  async share() {
    if (this.global.lang === 'en') {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Share ',
        buttons: [
          {
            text: 'Share by Email',
            role: 'email',
            icon: 'logo-googleplus',
            handler: () => { this.share_email(); }
          }, {
            text: 'Share on Facebook',
            role: 'facebook',
            icon: 'logo-facebook',
            handler: () => { this.share_facebook(); }
          }, {
            text: 'Share on Twitter',
            role: 'twitter',
            icon: 'logo-twitter',
            handler: () => { this.share_twitter(); }
          }, {
            text: 'Share with WhatsApp',
            role: 'whatsapp',
            icon: 'logo-whatsapp',
            handler: () => { this.share_WhatsApp(); }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => { }
          }
        ],
        cssClass: 'share_action'
      });
      actionSheet.present();
    }
    if (this.global.lang === 'ar') {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'مشاركة',
        buttons: [
          {
            text: 'شارك عبر البريد الإلكتروني',
            role: 'email',
            icon: 'logo-googleplus',
            handler: () => { this.share_email(); }
          }, {
            text: 'شارك علي الفيسبوك',
            role: 'facebook',
            icon: 'logo-facebook',
            handler: () => { this.share_facebook(); }
          }, {
            text: 'شارك على تويتر',
            role: 'twitter',
            icon: 'logo-twitter',
            handler: () => { this.share_twitter(); }
          }, {
            text: 'شارك مع WhatsApp',
            role: 'whatsapp',
            icon: 'logo-whatsapp',
            handler: () => { this.share_WhatsApp(); }
          }, {
            text: 'الغاء',
            role: 'cancel',
            handler: () => { }
          }
        ],
        cssClass: 'share_action'
      });
      actionSheet.present();
    }
  }

  share_email() {
    // Share via email
    this.socialSharing.shareViaEmail(this.text + '<br/>' + this.app_link, 'Hybapps', []).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

  share_facebook() {
    this.socialSharing.shareViaFacebook(null, this.hybapps_img, null).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });

  }
  share_twitter() {
    this.socialSharing.shareViaFacebook(null, this.hybapps_img, null).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });


  }
  share_WhatsApp() {
    this.socialSharing.shareViaFacebook(null, this.hybapps_img, null).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });


  }
}
