import { Component, OnInit, Input } from '@angular/core';
import { Article } from 'src/app/interfaces/interfaces';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DataLocalService } from 'src/app/services/data-local.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {
  @Input() indice: number;
  @Input() noticia: Article;
  @Input() enFavoritos;

  constructor(private iab: InAppBrowser, 
    private actionSheetCtrl: ActionSheetController, 
    private socialSharing: SocialSharing, 
    private datalocalService: DataLocalService,
    public toastController: ToastController,
    private platform: Platform) { }

  ngOnInit() {}

  abrirNoticia() {
    const browser = this.iab.create(this.noticia.url, '_system');
  }

  async lanzarMenu() {
    let guardarBorrarBtn;
    if (this.enFavoritos) {
      guardarBorrarBtn = {
        text: 'Delete favorite',
        icon: 'trash',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Favorite clicked');
          this.datalocalService.borrarNoticia(this.noticia);
          this.presentToastDelFavoritos();
        }
      };
    } else {
      guardarBorrarBtn = {
        text: 'Favorite',
        icon: 'star',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Favorite clicked');
          this.datalocalService.guardarNoticia(this.noticia);
          this.presentToastFavoritos();
        }
      };
    }
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [{
        text: 'Share',
        icon: 'share',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Share clicked');

          this.compartirNoticia();
        }
      }, guardarBorrarBtn,
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentToastFavoritos() {
    const toast = await this.toastController.create({
      message: 'Guardado en favoritos.',
      duration: 2000
    });
    toast.present();
  }

  async presentToastDelFavoritos() {
    const toast = await this.toastController.create({
      message: 'Borrado de favoritos.',
      duration: 2000
    });
    toast.present();
  }

  compartirNoticia() {

    if (this.platform.is('cordova')) {
      this.socialSharing.share(
        this.noticia.title,
        this.noticia.source.name,
        '',
        this.noticia.url
      );
    }

  }

}
