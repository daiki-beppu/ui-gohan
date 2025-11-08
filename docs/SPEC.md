# プロジェクト仕様書

## 1. プロジェクト概要

### プロジェクト名

**ui-gohan**

### 目的

一週間の献立を管理するモバイルアプリケーション。毎日の献立を事前に計画し、オフラインでも利用できることを重視。

### ターゲットユーザー

- 特定の個人向け（初期は個人利用）
- 将来的には一般ユーザーへの展開を想定

### 開発体制

- **開発期間**: 1-3ヶ月（MVP）
- **チーム規模**: 個人開発
- **開発フェーズ**: MVP開発フェーズ

---

## 2. 技術スタック

### フロントエンド

| 項目           | 技術                         | 備考                                                      |
| -------------- | ---------------------------- | --------------------------------------------------------- |
| フレームワーク | Expo (React Native)          | モバイルアプリ開発                                        |
| 言語           | TypeScript                   | 型安全性の確保                                            |
| UIライブラリ   | React Native Reusables       | shadcn/uiベースのReact Native UIコンポーネント            |
| 状態管理       | React state + TanStack Query | ローカル状態管理 + サーバーキャッシュ管理(オフライン対応) |
| ナビゲーション | 未定                         | MVP開発中に決定                                           |

### バックエンド・データベース

| 項目         | 技術        | 備考                                                              |
| ------------ | ----------- | ----------------------------------------------------------------- |
| データベース | Turso Cloud | SQLiteベースのクラウドDB、オフラインファースト対応                |
| ORM          | Drizzle ORM | 軽量で型安全なORM、Turso公式サポート                              |
| 同期方式     | Turso Sync  | ローカルレプリカとクラウド間の自動同期                            |
| 認証         | Better Auth | Expo公式対応、Drizzle ORM統合、セッション管理・トークン管理自動化 |

### 開発・テスト

| 項目                 | 技術 | 備考               |
| -------------------- | ---- | ------------------ |
| テストフレームワーク | Jest | 単体テストのみ実装 |
| バージョン管理       | Git  | GitHub使用         |

### 対応プラットフォーム

#### MVP（初期リリース）

- **iOS**: iPhone向けネイティブアプリ

#### 将来的な対応予定

- **Android**: Androidスマートフォン向け
- **Web**: Next.js + モノレポ構成で展開

---

## 3. 機能要件

### 3.1 MVP機能

#### 一週間献立管理

- 月曜日から日曜日の7日間分の献立リストを表示
- 各曜日に複数の献立（朝・昼・夜など）を追加可能
- 献立は月曜日から順番にリスト形式で表示

#### CRUD操作

- **作成**: 新しい献立を追加
- **読取**: 登録済み献立の表示
- **更新**: 献立の編集（料理名、メモなど）
- **削除**: 献立の削除

#### ドラッグ&ドロップ並び替え機能

- 献立をドラッグ操作で並び替え可能
- リスト内の位置に応じて曜日が自動変更
  - 例: 1番目 → 月曜日、2番目 → 火曜日、3番目 → 水曜日...
- 並び替え後、即座にデータベースに反映

#### 認証機能（Better Auth）

- ゲストログイン（匿名認証）
  - ユーザー登録なしで即座に利用開始
  - 端末にデータを保存
  - 後からアカウント作成可能
- メール/パスワード認証
  - アカウント作成
  - ログイン
  - パスワードリセット機能
- 自動セッション管理（useSession hook）
- トークンの自動リフレッシュ
- expo-secure-storeへの自動保存

#### オフライン対応

- ネットワーク接続がなくても全機能を利用可能
- ローカルDBに保存し、オンライン時に自動同期

### 3.2 将来追加予定機能

| 機能                     | 優先度 | 備考                                         |
| ------------------------ | ------ | -------------------------------------------- |
| ソーシャルログイン       | 高     | Google, Apple OAuth認証                      |
| 画像アップロード         | 高     | 料理の写真を保存                             |
| プッシュ通知             | 中     | 献立のリマインダー                           |
| データ共有               | 中     | 家族や友人と献立を共有                       |
| データエクスポート       | 低     | CSV等での出力                                |
| レシピ保存               | 中     | 献立に紐づくレシピ情報                       |
| 買い物リスト生成         | 高     | 献立から必要な食材を自動抽出                 |
| ゲストからアカウント移行 | 中     | ゲストユーザーのデータを正式アカウントに移行 |

### 3.3 非実装機能（MVP）

- 検索・フィルター機能
- リアルタイム同期（他ユーザーとの）
- 多言語対応

---

## 4. 非機能要件

### 4.1 パフォーマンス

- アプリ起動時間: 3秒以内
- データ読み込み: 1秒以内（ローカルDB）
- オフラインからオンライン同期: バックグラウンドで実行

### 4.2 セキュリティ

- ローカルデータは端末内に安全に保存
- パスワードのハッシュ化（Better Authによる自動処理）
- セッショントークンの安全な管理
- HTTPS通信の使用（API通信時）
- ソーシャルログイン時のOAuth 2.0準拠
- CSRF保護（Better Authによる自動処理）
- XSS対策（入力値のサニタイゼーション）
- 将来的な同期機能実装時にはデータ暗号化を検討

### 4.3 ユーザビリティ

- 直感的な操作性
- シンプルなUI/UX
- 日本語のみ対応

### 4.4 可用性

- オフラインでの動作保証
- データ損失を防ぐ自動保存

### 4.5 保守性

- TypeScriptによる型安全性
- テストコードの記述（Jest）
- コードの可読性を重視

---

## 5. 画面構成

### 5.1 画面一覧（MVP）

#### 1. ウェルカム画面（初回起動時）

- アプリの説明
- ゲストとして始めるボタン（メイン）
- ログインリンク（既存ユーザー向け）

#### 2. ログイン画面

- メールアドレス入力
- パスワード入力
- ログインボタン
- アカウント作成リンク
- パスワードリセットリンク
- ゲストとして始めるリンク

#### 3. アカウント作成画面

- 名前入力（任意）
- メールアドレス入力
- パスワード入力
- パスワード確認入力
- アカウント作成ボタン
- ログイン画面へのリンク

#### 4. パスワードリセット画面

- メールアドレス入力
- リセットメール送信ボタン

#### 5. ホーム画面（一週間献立リスト）

- 月から日の7日分を表示
- 各曜日に献立カードを表示
- 献立追加ボタン
- ログアウトボタン（設定メニュー内）

#### 6. 設定画面（ゲストユーザー向け）

- アカウント作成を促すバナー
- アカウント作成ボタン
- データのバックアップ警告

#### 7. 献立追加・編集画面

- 料理名入力
- メモ入力（任意）
- 保存・キャンセルボタン

#### 8. 献立詳細画面

- 献立の詳細情報表示
- 編集・削除ボタン

### 5.2 ナビゲーション構成

**未定**: MVP開発中に以下から選定

- タブナビゲーション
- スタックナビゲーション
- シンプルな1画面構成

---

## 6. データモデル

### 6.1 ユーザー（User）

```typescript
interface User {
  id: string; // UUID
  email: string; // メールアドレス（一意）
  name?: string; // ユーザー名（任意）
  emailVerified: boolean; // メール認証済みフラグ
  image?: string; // プロフィール画像URL（任意）
  createdAt: Date; // 作成日時
  updatedAt: Date; // 更新日時
}
```

**Better Authによる管理テーブル:**

- `user`: ユーザー基本情報
- `session`: セッション管理
- `account`: ソーシャルログイン連携情報（Google, Apple）
- `verification`: メール認証トークン

### 6.2 献立（Menu）

```typescript
interface Menu {
  id: string; // UUID
  userId: string; // ユーザーID（外部キー）
  dayOfWeek: DayOfWeek; // 曜日（0-6: 日-土）※ドラッグ操作で自動更新
  mealType: MealType; // 食事タイプ（朝・昼・夜など）
  dishName: string; // 料理名
  memo?: string; // メモ（任意）
  sortOrder: number; // 表示順序（ドラッグ&ドロップ時に更新）
  createdAt: Date; // 作成日時
  updatedAt: Date; // 更新日時
}

enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

enum MealType {
  Breakfast = 'breakfast', // 朝食
  Lunch = 'lunch', // 昼食
  Dinner = 'dinner', // 夕食
}
```

#### データモデルの仕様補足

**ドラッグ&ドロップ時の動作:**

1. リスト内での位置（インデックス）を`sortOrder`に保存
2. `sortOrder`に基づいて`dayOfWeek`を自動計算
   - `sortOrder` 0-6 → `dayOfWeek` Monday-Sunday
   - 例: `sortOrder = 0` → `dayOfWeek = Monday(1)`
   - 例: `sortOrder = 2` → `dayOfWeek = Wednesday(3)`
3. 並び替え操作時は複数レコードの`sortOrder`と`dayOfWeek`を一括更新

### 6.2 将来追加予定のデータモデル

#### レシピ（Recipe）

```typescript
interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  steps: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Ingredient {
  name: string;
  quantity: string;
}
```

---

## 7. 技術的な課題・検討事項

### 7.1 Better Authによる認証実装

- Better AuthとDrizzle ORMの統合
  - Drizzle Adapter を使用してTurso Cloudに接続
  - ユーザー、セッション、アカウントテーブルの自動管理
- Expo環境でのBetter Auth設定
  - `@better-auth/expo` プラグインの導入
  - Expo API Routes での Better Auth バックエンド構築
  - `expo-secure-store` による安全なトークン保存
- ゲストログイン（匿名認証）の実装
  - Better Auth の Anonymous プラグイン使用
  - 端末ごとに一意のゲストユーザー作成
  - セッションの永続化
  - ゲストユーザーのデータ管理
- メール/パスワード認証の実装
  - アカウント作成
  - ログイン
  - パスワードリセット（メール送信）
- メール送信機能の実装
  - SMTP設定またはメール送信サービス統合（Resend推奨）
  - パスワードリセットメール
- セッション管理
  - `useSession` hook による自動セッション管理
  - トークンの自動リフレッシュ
  - セッションキャッシュ（SecureStore）
- 認証が必要なAPIリクエスト
  - `authClient.getCookie()` でトークンを取得
  - リクエストヘッダーに自動付与
- ログイン状態での画面遷移制御
  - Expo Router の認証ガード実装
  - ゲストユーザーとログインユーザーの区別

### 7.2 オフラインファースト実装

- Turso Cloudのローカルレプリカ機能の活用
- Turso Syncによるオンライン復帰時の自動同期
- コンフリクト解決戦略（Tursoの標準機能を活用）
- ネットワーク状態の監視と同期タイミング

### 7.2 Drizzle ORMとデータベース設計

- Drizzle ORMのスキーマ定義とマイグレーション管理
- Turso Cloudとの接続設定（ローカル・リモート両対応）
- 型安全なクエリの実装
- リレーションシップの設計

### 7.3 モノレポ構成

- 将来的なWeb版（Next.js）との共通化
- コード共有の設計（ロジック層・DB層の分離）
- Turso CloudとDrizzle ORMへのアクセスを共通化

### 7.4 ドラッグ&ドロップ機能の実装

- React Nativeでのドラッグ&ドロップライブラリ選定
  - 候補: react-native-draggable-flatlist, react-native-reanimated
- ドラッグ操作時のアニメーション実装
- 複数レコードの一括更新パフォーマンス最適化
- オフライン時のドラッグ操作とデータ整合性の保証

### 7.5 UIライブラリ(React Native Reusables)の習熟

- shadcn/uiスタイルのコンポーネント管理
- NativeWindによるスタイリング
- コンポーネントのカスタマイズとプロジェクトへの統合

---

## 8. 開発フェーズとマイルストーン

### Phase 1: 環境構築（1週間）

- Expoプロジェクトセットアップ
- React Native Reusables導入
- Turso Cloud設定（アカウント作成、データベース作成）
- Drizzle ORM導入とセットアップ
- Better Auth導入（`better-auth`, `@better-auth/expo`）
- 必要なExpoパッケージのインストール
  - `expo-secure-store`
  - `expo-linking`
  - `expo-web-browser`
  - `expo-constants`
- Metro Bundler設定（`unstable_enablePackageExports`）
- app.json にスキーム設定（例: `uika-gohan`）
- ローカル開発環境整備

### Phase 2: MVP開発（6-8週間）

- Better Auth バックエンド構築
  - Expo API Routes に Better Auth ハンドラーマウント（`app/api/auth/[...auth]+api.ts`）
  - Drizzle ORM統合（`drizzleAdapter`）
  - メール/パスワード認証有効化
  - Google, Apple OAuth設定
  - `trustedOrigins` 設定
- Better Auth クライアント実装
  - `createAuthClient` 設定
  - `expoClient` プラグイン追加
  - `expo-secure-store` 統合
- 認証機能実装
  - ログイン画面（メール/パスワード、ソーシャルログイン）
  - アカウント作成画面
  - パスワードリセット画面
  - Expo Router 認証ガード
- Drizzle ORMでのスキーマ定義（Menu）
- マイグレーション実行
- データモデル実装
- CRUD機能実装
- UI/UX実装（認証画面含む）
- オフライン機能実装
- テスト作成

### Phase 3: テスト・改善（2週間）

- バグフィックス
- パフォーマンス最適化
- ユーザビリティ改善

### Phase 4: リリース準備（1週間）

- App Store申請準備
- ドキュメント整備

---

## 9. 参考資料・リンク

- [Expo公式ドキュメント](https://docs.expo.dev/)
- [React Native Reusables公式ドキュメント](https://rnr-docs.vercel.app/)
- [Turso公式ドキュメント](https://docs.turso.tech/)
- [Drizzle ORM公式ドキュメント](https://orm.drizzle.team/)
- [Drizzle ORM + Turso ガイド](https://orm.drizzle.team/docs/get-started-sqlite#turso)
- [Better Auth公式ドキュメント](https://www.better-auth.com/)
- [Better Auth + Drizzle ORM統合ガイド](https://www.better-auth.com/docs/integrations/drizzle)
- [Better Auth + Expo統合ガイド](https://www.better-auth.com/docs/integrations/expo)

---

## 更新履歴

| 日付       | バージョン | 変更内容                                               | 更新者 |
| ---------- | ---------- | ------------------------------------------------------ | ------ |
| 2025-11-02 | 1.0.0      | 初版作成                                               | -      |
| 2025-11-03 | 1.1.0      | Better Auth認証機能の追加                              | -      |
| 2025-11-03 | 1.2.0      | Better Auth + Expo統合の詳細仕様追加                   | -      |
| 2025-11-03 | 1.3.0      | ゲストログイン追加、ソーシャルログインを将来機能に変更 | -      |
