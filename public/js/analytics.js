// src/public/js/analytics.js
(function(w){
  var safeDL = function(payload){
    try { w.dataLayer = w.dataLayer || []; w.dataLayer.push(payload); } catch(e) {}
  };
  var hasFBQ = function(){ try { return !!w.fbq; } catch(e){ return false; } };
  var toNumber = function(x){ var n = Number(x); return isNaN(n) ? 0 : n; };

  // ---- Eventos base
  w.appTrack = {
    initLanding: function(opts){
      // Para auditoría (GTM/GA4)
      safeDL({
        event: 'landing_init_js',
        landing_slug: (opts && opts.slug) || '',
        landing_template: (opts && opts.template) || ''
      });
      // Meta: se dispara LandingInit desde el parcial (si hay fbq)
    },

    // Recomendado GA4: select_item al hacer click en un producto del listado
    selectItem: function(p){
      // GA4
      safeDL({
        event: 'select_item',
        item_list_id: (p && p.list_id) || 'landing_list',
        item_list_name: (p && p.list_name) || 'Landing Grid',
        items: [{
          item_id: p && (p.sku || p.id),
          item_name: p && p.name,
          item_category: p && p.category,
          price: toNumber(p && p.price),
          currency: 'CLP'
        }]
      });
      // Opcional: evento legacy para debug en GTM
      safeDL({
        event: 'click_bsale_product',
        product_name: p && p.name,
        product_sku: p && (p.sku || p.id),
        product_price: toNumber(p && p.price),
        category: p && p.category
      });
      // Meta
      if (hasFBQ()){
        w.fbq('trackCustom', 'ClickComprar', {
          content_name: p && p.name,
          content_ids: [ p && (p.sku || p.id) ],
          content_type: 'product',
          value: toNumber(p && p.price),
          currency: 'CLP',
          category: p && p.category
        });
      }
    },

    // Recomendado GA4: view_item_list cuando renderizas la grilla
    viewItemList: function(payload){
      // payload: { list_id, list_name, items: [{item_id, item_name, item_category, price}] }
      safeDL(Object.assign({ event: 'view_item_list' }, payload));
    }
  };
})(window);