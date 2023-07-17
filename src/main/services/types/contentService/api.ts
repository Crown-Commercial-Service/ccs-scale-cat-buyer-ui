enum EndPoints {
  STATUS = '/wp-json/wp-api-menus/v2/menus',
  MENU = '/wp-json/wp-api-menus/v2/menus/:menuId'
};

type ContentServiceMenuItem = {
  id: number
  order: number
  parent: number
  title: string
  url: string
  attr: string
  target: string
  classes: string
  xfn: string
  description: string
  object_id: number
  object: string
  object_slug: string
  type: string
  type_label: string
}

type ContentServiceMenu = {
  ID: number
  name: string
  slug: string
  description: string
  count: number
  items: ContentServiceMenuItem[]
  meta: {
    links: {
      collection: string
      self: string
    }
  }
}

export { EndPoints, ContentServiceMenu };
