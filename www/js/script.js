// enums
const FETCHER_TIMEOUT = 2000;

/* 
  Sleep function for showing loader more.
*/
function sleep() {
  return new Promise(resolve => setTimeout(resolve, FETCHER_TIMEOUT));
}

/* 
  Global fetcher function which is using javascript fetch api.
  @url : string
  @options : https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
*/
const fetcher = async (url, options) => {
  let response;
  try {
    response = await fetch(url, options);
    let json = await response.json();
    return Promise.resolve(json);
  } catch (error) {
    return Promise.reject({ error: true })
  }
}


/*
  Get page data and return promise.
*/
const getPageData = async () => {
  await sleep();
  return await fetcher('/assets/data.json');
};

let initPage = {

  /* 
  Page State
  */
  state: {
    inProgress: null,
    data: null
  },


  /*
    page init function.
  */
  init: async function () {
    // first set loading true, we can define this initial state too
    this.renderLoading(true);

    // get page data
    var pageData = await getPageData();

    // set data to state
    this.state.data = pageData;

    // set page title
    document.title = this.state.data.title;

    // set loading to false, after page data fetched.
    this.renderLoading(false);

    // finally render sections
    this.renderSections();
  },

  /*
    Render Sections, like 
  */
  renderSections: function () {
    const { body, footer, header } = this.state.data;
    this.renderMenu()
    this.renderSection('body', body)
    this.renderSection('header-title', header)
    this.renderSection('footer', footer)
  },

  /* 
    @loading : boolean
  */
  renderLoading: function (loading) {
    this.state.inProgress = loading;
    document.getElementById('loader').style.display = loading ? 'flex' : 'none';
    document.getElementById('wrapper').style.display = loading ? 'none' : 'block';
  },


  /*
    @submenu : submenu array, { title, url }
  */
  renderSubmenu: function (submenu) {
    let submenuHtml = "";
    submenu.forEach(s => {
      submenuHtml += `<li class="menu__subitem">
        <a href="${s.url}">${s.title}</a>
      </li>`;
    });

    return `<ul class="hidden menu__sublist">
    ${submenuHtml}
    </ul>`;
  },

  /*
    @menu : menu array, { title, url }
  */
  renderMenu: function () {
    const { menu } = this.state.data;
    let menuHtml = "";

    menu.forEach(e => {
      menuHtml += e.submenu ? `<li class="menu__item"><a href="#">${e.title} ￬</a>${this.renderSubmenu(e.submenu)}</li>` : `<li class="menu__item"><a href="${e.url}">${e.title}</a></li>`;
    })
    this.renderSection('menu', `<ul class="menu__list">${menuHtml}</ul>`);
  },

  /*
    @id : document section id.
    @data : string
  */
  renderSection: function (id, data) {
    document.getElementById(id).innerHTML = data;
  }
};

initPage.init();

