/* eslint-disable */
import { UserAuthOperations } from './common';
import { User, UsersSelect } from './collections/user';
import { Media, MediaSelect } from './collections/media';
import { Download, DownloadsSelect } from './collections/download';
import { Leitende, LeitendeSelect } from './collections/leitende';
import { PhotoAlbum, PhotoAlbumsSelect } from './collections/photo-album';
import { ShopArticle, ShopArticlesSelect } from './collections/shop-article';
import { Stufen, StufenSelect } from './collections/stufen';
import { Uebungen, UebungenSelect } from './collections/uebungen';
import {
  PayloadKv,
  PayloadKvSelect,
  PayloadLockedDocument,
  PayloadLockedDocumentsSelect,
  PayloadPreference,
  PayloadPreferencesSelect,
  PayloadMigration,
  PayloadMigrationsSelect,
} from './collections/system';
import { Home, HomeSelect } from './globals/home';
import { JoinUs, JoinUsSelect } from './globals/join-us';
import { AboutUs, AboutUsSelect } from './globals/about-us';
import { ShopPage, ShopPageSelect } from './globals/shop';
import { PfadihausPage, PfadihausPageSelect } from './globals/pfadihaus';
import { DownloadsPage, DownloadsPageSelect } from './globals/downloads';
import { FotosPage, FotosPageSelect } from './globals/fotos';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    users: User;
    media: Media;
    downloads: Download;
    leitende: Leitende;
    'photo-albums': PhotoAlbum;
    'shop-articles': ShopArticle;
    stufen: Stufen;
    uebungen: Uebungen;
    'payload-kv': PayloadKv;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    downloads: DownloadsSelect<false> | DownloadsSelect<true>;
    leitende: LeitendeSelect<false> | LeitendeSelect<true>;
    'photo-albums': PhotoAlbumsSelect<false> | PhotoAlbumsSelect<true>;
    'shop-articles': ShopArticlesSelect<false> | ShopArticlesSelect<true>;
    stufen: StufenSelect<false> | StufenSelect<true>;
    uebungen: UebungenSelect<false> | UebungenSelect<true>;
    'payload-kv': PayloadKvSelect<false> | PayloadKvSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  fallbackLocale: null;
  globals: {
    home: Home;
    'join-us': JoinUs;
    'about-us': AboutUs;
    'shop-page': ShopPage;
    'pfadihaus-page': PfadihausPage;
    'downloads-page': DownloadsPage;
    'fotos-page': FotosPage;
  };
  globalsSelect: {
    home: HomeSelect<false> | HomeSelect<true>;
    'join-us': JoinUsSelect<false> | JoinUsSelect<true>;
    'about-us': AboutUsSelect<false> | AboutUsSelect<true>;
    'shop-page': ShopPageSelect<false> | ShopPageSelect<true>;
    'pfadihaus-page': PfadihausPageSelect<false> | PfadihausPageSelect<true>;
    'downloads-page': DownloadsPageSelect<false> | DownloadsPageSelect<true>;
    'fotos-page': FotosPageSelect<false> | FotosPageSelect<true>;
  };
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
