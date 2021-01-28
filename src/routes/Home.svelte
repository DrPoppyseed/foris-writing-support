<script>
  import MediaQuery from '../MediaQuery.svelte'
  import ButtonComp from '../components/ButtonComp.svelte'
  import HeaderComp from '../components/HeaderComp.svelte'
  import FooterComp from '../components/FooterComp.svelte'
  import QAComp from '../components/QAComp.svelte'
  import FeatureComp from '../components/FeatureComp.svelte'
  import StaffComp from '../components/StaffComp.svelte'
  import Link from 'svelte-routing/src/Link.svelte'
</script>

<HeaderComp />
<main>
  <!-- キャッチコピー　-->
  <section class="area area_about">
    <h1 class="ttl area_about_child">
      CollegeからUniversityへ転学<br />
      Universityへ進学するための<br />
      <strong>世界最高レベルの添削サービス</strong>
    </h1>
    <div class="area_about_child area_about_right">
      <h2 class="right_ttl">あなたの合格率を劇的アップ！</h2>
    </div>
  </section>
  <!-- 転学に重要なものとは　-->
  <section class="area area_need">
    <div class="head_home">
      <h1 class="ttl">転学・進学に重要なものって？</h1>
    </div>
    <div class="body_home">
      <p class="paragraph">
        転学・進学の合格に非常に重要になってくるのが、エッセイです。エッセイが最も重要な要素と言っても<br
          class="br"
        />
        過言ではありません。でも、実際に願書の準備などを始めてエッセイを書き始めてみると、<br
          class="br"
        />
        受かるエッセイにするのは非常に難しい問題です。
      </p>
    </div>
  </section>
  <!-- FORIS ESSAYの特徴　-->
  <section class="area area_features">
    <div class="head_home">
      <h2 class="ttl">
        FORIS ESSAYはあなたのエッセイを<br class="features_br" /><strong
          >受かる</strong
        >エッセイにします！
      </h2>
    </div>
    <div class="body_home">
      <FeatureComp
        point="1"
        title="世界的にトップスクール合格者のみが講師に。"
        description="コロンビア大学やワシントン大学などトップスクールと言われる
            大学に合格し、大学のチュータリング経験も豊富な講師が
            丁寧に対応いたします。"
      />
      <FeatureComp
        point="2"
        title="アイデアから細部まで丁寧な添削を。"
        description="合格するためのエッセイにはアイデアの部分から
						細部の文法までを完璧にする必要があります。
						FORIS ESSAYではしっかりと作り上げます"
      />
    </div>
  </section>
  <!-- ユーザーの目標　-->
  <section class="area_goal">
    <div class="triangle" />
    <div class="body_home">
      <p class="description">
        人生のキャリアが変わる大きな節目に世界最高レベルの添削サービスで<br
          class="goal_br"
        />
        希望校への<strong>合格</strong>を共に果たしましょう！
      </p>
    </div>
  </section>
  <!-- 講師紹介　-->
  <section class="area area_staff">
    <div class="head_home">
      <h2 class="ttl">FORIS ESSAY講師紹介</h2>
    </div>
    <div class="body_home">
      <StaffComp
        align="right"
        imageUrl="dummy_image.jpeg"
        imageAlt="dummy Image"
        name="Annalise Lineman"
        description="ワシントン大学シアトル校を2020年に卒業。大学では
					言語学・文学を専攻。ライティングセンターでの
					チュータリング経験も豊富で、TEFL(Teaching English
					as a Foreign Language Certificate)も所有。
					ワシントン大学の語学学校にて留学生に英語の講師
					経験もあります。"
      />
      <StaffComp
        align="left"
        imageUrl="dummy_image.jpeg"
        imageAlt="dummy Image"
        name="Khadijah"
        description="現役ワシントン大学シアトル校在学生。心理学を専攻し、
					アジア言語学を副専攻。シアトルセントラルカレッジと
					ワシントン大学シアトル校のライティングセンターの
					チューターに3年間従事。MESA(Mathmatics, Engineering,
					Science Achievement)のチューターも行っており、
					理系の視点においてもエッセイ添削を行うことができます。"
      />
    </div>
  </section>
  <!-- よくある質問　-->
  <section class="area area_qa">
    <div class="head_home">
      <h2 class="ttl">よくあるご質問</h2>
    </div>
    <div class="body_home">
      <QAComp
        question="何回の添削サービスを受けられますか？"
        answer="5回までがサービスの中に含まれておりますが、追加なども受け付けております。
          追加をご希望の場合は、随時お申し付けください。"
      />
      <QAComp
        question="締め切り日はありますか？"
        answer="希望校の出願締め切り日の2ヶ月前までにご応募をお願いいたします。
          万が一、出願までに回数分が利用できない、もしくは全ての回数を必要でない場合は
          一部返金対応させていただきますので、お申し付けくださいませ。"
      />
      <QAComp
        question="もうエッセイを書き始めてても応募できますか？"
        answer="はい、もちろんです。すでに書いておられる内容に対し、添削を行わせていただきます。
          アイデアから細部までしっかりと丁寧に対応いたします。"
      />
      <QAComp
        question="このサービスはオンラインですか？"
        answer="はい。Zoomというアプリを使用させていただきます。ご指定いただくお時間になりましたら
          Zoomにて入室していただく運びとなります。"
      />
    </div>
  </section>
  <!-- 全体の流れ　-->
  <section class="area area_flow">
    <div class="head_home">
      <h2 class="ttl">全体の流れ</h2>
    </div>
    <div class="body_home">
      <p class="flow">
        1.ご応募　＞＞　2.日程調整　＞＞　3.添削開始 　＞＞　4.出願
      </p>
      <p class="flow_mobile">
        1.ご応募<br />
        2.日程調整<br />
        3.添削開始<br />
        4.出願
      </p>
    </div>
  </section>
  <!-- 購入　-->
  <section class="area area_subscribe">
    <div class="body_home">
      <div class="image_container">
        <img
          class="campaign_image"
          src="imgs/campaign_desktop.png"
          alt="キャンペーン画像"
        />
      </div>
      <div class="subscribe_btn_container">
        <ButtonComp />
      </div>
    </div>
  </section>
</main>
<FooterComp />

<style>
  :root {
    --lightBlue: #a0c2de;
    --darkBlue: #064780;
    --darkRed: #745f5f;
    --secondary: white;
    font-family: 'Noto Sans Japanese', sans-serif;
    overflow-x: hidden;
  }
  .area {
    padding: 0 10%;
  }
  /* catch copy */
  .area_about {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .area_about .ttl {
    color: var(--lightBlue);
    font-size: 40px;
    line-height: 1.5;
  }
  .area_about_right {
    background: red;
    height: 400px;
    width: 50%;
    display: block;
    border-radius: 300px 0 0 300px;
    position: relative;
  }
  .right_ttl {
    color: white;
    position: absolute;
    font-size: 30px;
    white-space: nowrap;
    font-weight: 300;
    margin-top: 32px;
    left: 10%;
    top: 40%;
    transform: translate(-0%, -40%);
  }
  .area_about strong {
    color: var(--darkBlue);
  }

  .head_home {
    display: flex;
    justify-content: center;
  }
  .head_home .ttl {
    /* font: 400 50px 'Hiragino Kaku Gothic ProN W3'; */
    font-weight: 300;
    font-size: 36px;
    line-height: 1.5;
  }

  /* need */
  .area_need {
    color: var(--secondary);
    background: var(--darkBlue);
    padding: 100px 0;
  }
  .area_need .ttl {
    font-size: 30px;
  }
  .area_need .paragraph {
    text-align: center;
    font-family: 'Hiragino Kaku Gothic ProN W3';
    font-size: 20px;
    line-height: 2;
  }

  /* feature */
  .area_features {
    color: var(--darkBlue);
    padding-top: 130px;
    padding-bottom: 200px;
  }
  .area_features .body_home {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .features_br {
    display: none;
  }

  /* goal */
  .area_goal {
    width: 100%;
    color: var(--secondary);
    background: var(--lightBlue);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .triangle {
    width: 0;
    height: 0;
    border-width: 0 10vw 8vw 10vw;
    border-color: var(--secondary) transparent var(--secondary) transparent;
    border-style: solid;
    transform: rotate(180deg);
  }
  .area_goal .body_home {
    padding: 30px 0 50px;
    text-align: center;
  }

  .area_goal .description {
    font-size: 30px;
  }

  /* staff */
  .area_staff {
    background: var(--darkBlue);
    color: var(--secondary);
    padding-top: 0 100px;
  }

  .area_staff .body_home {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* q&a */
  .area_qa {
    background: var(--lightBlue);
    color: var(--darkBlue);
    padding-top: 80px;
    padding-bottom: 80px;
  }
  .area_qa .body_home {
    justify-content: center;
  }

  /* flow */
  .area_flow {
    color: var(--secondary);
    background: var(--darkBlue);
    padding: 50px 0 60px;
  }
  .area_flow .ttl {
    font-size: 30px;
  }
  .area_flow .flow {
    font-size: 35px;
    text-align: center;
    display: block;
  }
  .flow_mobile {
    display: none;
  }

  /* subscribe */
  .image_container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .campaign_image {
    width: 100%;
  }
  .area_subscribe .body_home {
    font-size: 30px;
    color: var(--darkRed);
  }
  .area_subscribe .subscribe_btn_container {
    justify-items: center;
    margin-top: 20px;
    margin: 0 100px 100px;
    box-shadow: 2px 2px 4px -2px gray inset;
  }

  @media screen and (min-width: 1025px) and (max-width: 1280px) {
    .area {
      padding: 0 5%;
    }
    .area_about .ttl,
    .area_about strong {
      font-size: 36px;
      line-height: 1.5;
    }
    .right_ttl {
      font-size: 26px;
      margin-top: 40px;
    }
    .area_need {
      padding: 60px 0;
    }

    .area_features {
      padding: 80px 0 140px;
    }
    .area_features .ttl {
      font-size: 33px;
      white-space: nowrap;
    }
    .area_features strong {
      font-size: 36px;
    }
    .features_br {
      display: none;
    }

    .triangle {
      border-width: 0 14vw 10vw 14vw;
    }
    .area_qa {
      padding-bottom: 80px;
    }
    .area_flow {
      padding: 20px 0 30px;
    }
    .area_flow .flow {
      font-size: 30px;
      display: block;
    }
    .flow_mobile {
      display: none;
    }
  }
  @media screen and (min-width: 801px) and (max-width: 1024px) {
    .area {
      padding: 0 5%;
    }
    .area_about .ttl,
    .area_about strong {
      font-size: 28px;
      line-height: 1.5;
    }
    .area_about_right {
      height: 280px;
      /* width: 45%; */
    }
    .right_ttl {
      font-size: 22px;
      margin-top: 25px;
    }
    .area_need {
      padding: 40px 0;
    }
    .area_need .ttl {
      font-size: 24px;
    }
    .area_need .paragraph {
      font-size: 16px;
    }
    .area_features {
      padding: 80px 0;
    }

    .area_features .ttl {
      font-size: 26px;
    }
    .area_features strong {
      font-size: 28px;
    }
    .features_br {
      display: none;
    }
    .triangle {
      border-width: 0 14vw 10vw 14vw;
    }
    .area_goal .description {
      font-size: 22px;
    }
    .area_goal strong {
      font-size: 26px;
    }
    .area_staff {
      padding: 80px 0;
    }
    .area_staff .ttl {
      font-size: 28px;
    }
    .area_qa {
      padding: 40px 5%;
    }
    .area_qa .ttl {
      font-size: 26px;
    }
    .area_flow {
      padding: 40px 0;
    }
    .area_flow .ttl {
      font-size: 26px;
    }
    .area_flow .flow {
      font-size: 22px;
    }
    .flow_mobile {
      display: none;
    }
  }
  @media screen and (max-width: 800px) and (min-width: 481px) {
    .area_about {
      text-align: center;
      padding: 80px 0;
    }
    .area_about .ttl,
    .area_about strong {
      font-size: 32px;
      line-height: 1.5;
    }
    .area_about .ttl {
      width: 100%;
    }
    .area_about_right {
      display: none;
    }
    .area_need {
      padding: 40px 5%;
    }
    .area_need .ttl {
      font-size: 22px;
    }
    .area_need .paragraph {
      font-size: 16px;
    }
    .br {
      display: none;
    }
    .area_features {
      padding: 40px 0 60px;
    }
    .area_features .ttl {
      font-size: 22px;
      text-align: center;
    }
    .area_features strong {
      font-size: 24px;
    }
    .features_br {
      display: block;
    }
    .triangle {
      border-width: 0 14vw 10vw 14vw;
    }
    .area_goal {
      padding: 0 5%;
      width: 90%;
    }
    .area_goal .description {
      font-size: 18px;
      text-align: center;
    }
    .area_goal strong {
      font-size: 20px;
    }
    .goal_br {
      display: none;
    }
    .area_staff .ttl {
      font-size: 22px;
    }
    .area_staff {
      padding: 40px 5%;
    }
    .area_qa {
      padding: 40px 5%;
    }
    .area_qa .ttl {
      font-size: 22px;
    }
    .area_flow {
      padding: 20px 5%;
    }
    .area_flow .ttl {
      font-size: 22px;
    }
    .area_flow .flow {
      display: none;
    }
    .flow_mobile {
      text-align: center;
      display: block;
      font-size: 18px;
      line-height: 2;
    }
    .area_subscribe .subscribe_btn_container {
      margin: 20px 0 40px;
    }
  }
  @media screen and (max-width: 480px) {
    .area_about {
      text-align: center;
      padding: 30px 0;
    }
    .area_about .ttl,
    .area_about strong {
      font-size: 22px;
      line-height: 1.5;
    }
    .area_about .ttl {
      width: 100%;
    }
    .area_about_right {
      display: none;
    }
    .area_need {
      padding: 30px 5%;
    }
    .area_need .ttl {
      font-size: 20px;
    }
    .area_need .paragraph {
      font-size: 16px;
      text-align: left;
      line-height: 1.2;
    }
    .br {
      display: none;
    }
    .area_features {
      padding: 40px 0 60px;
      width: 100%;
    }
    .area_features .ttl {
      font-size: 20px;
      text-align: center;
      width: 90%;
    }
    .area_features strong {
      font-size: 22px;
    }
    .features_br {
      display: none;
    }
    .triangle {
      border-width: 0 14vw 10vw 14vw;
    }
    .area_goal {
      padding: 0 5%;
      width: 90%;
    }
    .area_goal .description {
      font-size: 16px;
      text-align: center;
    }
    .area_goal strong {
      font-size: 20px;
    }
    .goal_br {
      display: none;
    }
    .area_staff .ttl {
      font-size: 20px;
    }
    .area_staff {
      padding: 40px 5%;
    }
    .area_qa {
      padding: 40px 5%;
    }
    .area_qa .ttl {
      font-size: 20px;
    }
    .area_flow {
      padding: 20px 5%;
    }
    .area_flow .ttl {
      font-size: 20px;
    }
    .area_flow .flow {
      display: none;
    }
    .flow_mobile {
      text-align: center;
      display: block;
      font-size: 18px;
      line-height: 2;
    }
    .area_subscribe {
      padding: 0;
    }
    .area_subscribe .subscribe_btn_container {
      margin: 20px 5% 40px;
    }
  }
</style>
