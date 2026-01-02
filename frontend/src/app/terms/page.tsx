export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">利用規約</h1>

        <div className="space-y-8 text-gray-700">
          <section>
            <p className="mb-4 leading-relaxed">
              この利用規約（以下、「本規約」といいます。）は、ぽんダナ（以下、「当サービス」といいます。）の利用条件を定めるものです。
              登録ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って、当サービスをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">第1条（適用）</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                本規約は、ユーザーと当サービスの利用に関わる一切の関係に適用されるものとします。
              </li>
              <li>
                当サービスは本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下、「個別規定」といいます。）をすることがあります。
                これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。
              </li>
              <li>
                本規約の規定が前条の個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">第2条（利用登録）</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                当サービスにおいては、登録希望者が本規約に同意の上、当サービスの定める方法によって利用登録を申請し、当サービスがこれを承認することによって、利用登録が完了するものとします。
              </li>
              <li>
                当サービスは、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                  <li>本規約に違反したことがある者からの申請である場合</li>
                  <li>その他、当サービスが利用登録を相当でないと判断した場合</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              第3条（ユーザーIDおよびパスワードの管理）
            </h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                ユーザーは、自己の責任において、当サービスのユーザーIDおよびパスワードを適切に管理するものとします。
              </li>
              <li>
                ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。
                当サービスは、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。
              </li>
              <li>
                ユーザーID及びパスワードが第三者によって使用されたことによって生じた損害は、当サービスに故意又は重大な過失がある場合を除き、当サービスは一切の責任を負わないものとします。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">第4条（禁止事項）</h2>
            <p className="mb-4">
              ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>
                当サービス、当サービスの他のユーザー、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
              </li>
              <li>当サービスの運営を妨害するおそれのある行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>他のユーザーに成りすます行為</li>
              <li>当サービスが許諾しない当サービス上での宣伝、広告、勧誘、または営業行為</li>
              <li>
                当サービスのサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
              </li>
              <li>その他、当サービスが不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              第5条（本サービスの提供の停止等）
            </h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                当サービスは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                  <li>
                    地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
                  </li>
                  <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                  <li>その他、当サービスが本サービスの提供が困難と判断した場合</li>
                </ul>
              </li>
              <li>
                当サービスは、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              第6条（利用制限および登録抹消）
            </h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                当サービスは、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>本規約のいずれかの条項に違反した場合</li>
                  <li>登録事項に虚偽の事実があることが判明した場合</li>
                  <li>その他、当サービスが本サービスの利用を適当でないと判断した場合</li>
                </ul>
              </li>
              <li>
                当サービスは、本条に基づき当サービスが行った行為によりユーザーに生じた損害について、一切の責任を負いません。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">第7条（免責事項）</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                当サービスは、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
              </li>
              <li>
                当サービスは、本サービスに起因してユーザーに生じたあらゆる損害について、当サービスの故意又は重過失による場合を除き、一切の責任を負いません。
              </li>
              <li>
                当サービスは、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              第8条（サービス内容の変更等）
            </h2>
            <p className="leading-relaxed">
              当サービスは、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">第9条（利用規約の変更）</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                当サービスは以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>本規約の変更がユーザーの一般の利益に適合するとき。</li>
                  <li>
                    本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき。
                  </li>
                </ul>
              </li>
              <li>
                当サービスはユーザーに対し、前項による本規約の変更にあたり、事前に、本規約を変更する旨及び変更後の本規約の内容並びにその効力発生時期を通知します。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              第10条（準拠法・裁判管轄）
            </h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
              <li>
                本サービスに関して紛争が生じた場合には、当サービスの所在地を管轄する裁判所を専属的合意管轄とします。
              </li>
            </ol>
          </section>

          <section className="mt-12 text-right text-sm text-gray-600">
            <p>最終更新日: 2026年1月2日</p>
          </section>
        </div>
      </div>
    </div>
  );
}
