export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">プライバシーポリシー</h1>

        <div className="space-y-8 text-gray-700">
          <section>
            <p className="leading-relaxed">
              ぽんダナ（以下、「当サービス」といいます。）は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">第1条（収集する情報）</h2>
            <p className="mb-4">当サービスは、ユーザーから以下の情報を取得します。</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                メールアドレス
                <p className="mt-1 text-sm">アカウント登録およびログインに使用されます。</p>
              </li>
              <li>
                パスワード
                <p className="mt-1 text-sm">
                  アカウント認証に使用されます（暗号化して保存されます）。
                </p>
              </li>
              <li>
                ユーザーが作成したコンテンツ
                <p className="mt-1 text-sm">書籍の記録、感想、ナレッジカード等の投稿内容。</p>
              </li>
              <li>
                利用履歴
                <p className="mt-1 text-sm">アクセス日時、IPアドレス、ブラウザ情報等のログ情報。</p>
              </li>
              <li>
                Cookie およびその他の技術情報
                <p className="mt-1 text-sm">
                  サービスの利便性向上およびセキュリティ確保のために使用されます。
                </p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">第2条（利用目的）</h2>
            <p className="mb-4">当サービスは、取得した個人情報を以下の目的で利用します。</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>本サービスの提供・運営のため</li>
              <li>ユーザーからのお問い合わせに対応するため</li>
              <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等の案内をするため</li>
              <li>メンテナンス、重要なお知らせなど必要に応じた連絡を行うため</li>
              <li>
                利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
              </li>
              <li>
                ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため
              </li>
              <li>本サービスの改善および新サービスの開発のため</li>
              <li>上記の利用目的に付随する目的</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">第3条（利用目的の変更）</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                当サービスは、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
              </li>
              <li>
                利用目的の変更を行った場合には、変更後の目的について、当サービス所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              第4条（個人情報の第三者提供）
            </h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                当サービスは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>
                    人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
                  </li>
                  <li>
                    公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
                  </li>
                  <li>
                    国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
                  </li>
                </ul>
              </li>
              <li>
                前項の定めにかかわらず、次に掲げる場合には、当該情報の提供先は第三者に該当しないものとします。
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>
                    当サービスが利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合
                  </li>
                  <li>合併その他の事由による事業の承継に伴って個人情報が提供される場合</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">第5条（個人情報の開示）</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                当サービスは、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>
                    本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合
                  </li>
                  <li>当サービスの業務の適正な実施に著しい支障を及ぼすおそれがある場合</li>
                  <li>その他法令に違反することとなる場合</li>
                </ul>
              </li>
              <li>
                前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、原則として開示いたしません。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              第6条（個人情報の訂正および削除）
            </h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                ユーザーは、当サービスの保有する自己の個人情報が誤った情報である場合には、当サービスが定める手続きにより、当サービスに対して個人情報の訂正、追加または削除（以下、「訂正等」といいます。）を請求することができます。
              </li>
              <li>
                当サービスは、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。
              </li>
              <li>
                当サービスは、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをユーザーに通知します。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              第7条（個人情報の利用停止等）
            </h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                当サービスは、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下、「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。
              </li>
              <li>
                前項の調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。
              </li>
              <li>
                当サービスは、前項の規定に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをユーザーに通知します。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              第8条（Cookie（クッキー）その他の技術の利用）
            </h2>
            <p className="mb-4 leading-relaxed">
              当サービスは、Cookieおよびこれに類する技術を利用することがあります。これらの技術は、当サービスによる本サービスの利用状況等の把握に役立ち、サービス向上に資するものです。
              Cookieを無効化されたいユーザーは、ウェブブラウザの設定を変更することによりCookieを無効化することができます。ただし、Cookieを無効化すると、本サービスの一部の機能をご利用いただけなくなる場合があります。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              第9条（外部サービスの利用）
            </h2>
            <p className="mb-4">当サービスは、以下の外部サービスを利用しています。</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Supabase</strong>
                <p className="mt-1 text-sm">
                  認証およびデータベース管理に使用しています。Supabaseのプライバシーポリシーは
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    こちら
                  </a>
                  をご確認ください。
                </p>
              </li>
              <li>
                <strong>Vercel</strong>
                <p className="mt-1 text-sm">
                  ホスティングサービスとして使用しています。Vercelのプライバシーポリシーは
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    こちら
                  </a>
                  をご確認ください。
                </p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              第10条（プライバシーポリシーの変更）
            </h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。
              </li>
              <li>
                当サービスが別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              第11条（お問い合わせ窓口）
            </h2>
            <p className="leading-relaxed">
              本ポリシーに関するお問い合わせは、本サービス内のお問い合わせフォームまたはメールにて受け付けております。
            </p>
          </section>

          <section className="mt-12 text-right text-sm text-gray-600">
            <p>最終更新日: 2026年1月2日</p>
          </section>
        </div>
      </div>
    </div>
  );
}
