import { Database } from 'vuex-orm'
import User from './models/User'
import users from './modules/users'
import Todo from './models/Todo'
import todos from './modules/todos'

import { Color, Palette, Bitmap, Artwork } from './models/MoeModels'
import { colors, palettes, bitmaps, artworks } from './modules/MoeModules'

const database = new Database()

database.register(User, users)
database.register(Todo, todos)

database.register(Color, colors)
database.register(Palette, palettes)
database.register(Bitmap, bitmaps)
database.register(Artwork, artworks)

export default database
