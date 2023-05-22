import { Header } from './components/Header'
import { Post } from './components/Post'
import { Sidebar } from './components/Sidebar'

import './global.css'
import styles from './App.module.css'

const posts = [
  {
    id: 1,
    author: {
      avatarUrl: 'https://github.com/juliocesarc.png',
      name: 'Julio César',
      role: 'Admin'
    },
    content: [
      {type: 'paragraph', content: 'Fala galeraa!',},
      {type: 'paragraph', content: 'Acabei de subir mais um projeto no meu portifa. É um projeto que fiz no NLW return, evento da RocketSeat. O nome do projeto é DoctorCare!',},
      {type: 'link', content: 'julio.design/doctorcare',},

    ],
    publishedAt: new Date('2023-05-04 20:00:00')
  },
  {
    id: 2,
    author: {
      avatarUrl: 'https://github.com/maykbrito.png',
      name: 'Mayk Brito',
      role: 'Admin'
    },
    content: [
      {type: 'paragraph', content: 'Fala galeraa!',},
      {type: 'paragraph', content: 'Acabei de subir mais um projeto no meu portifa. É um projeto que fiz no NLW return, evento da RocketSeat. O nome do projeto é DoctorCare!',},
      {type: 'link', content: 'julio.design/doctorcare',},

    ],
    publishedAt: new Date('2023-05-05 20:00:00')
  },
]

export function App() {
  return (
    <div>
      <Header />
      <div className={styles.wrapper}>
        <Sidebar />
        <main>
          {posts.map(post => {
            return (
              <Post 
                key={post.id}
                author={post.author}
                content={post.content}
                publishedAt={post.publishedAt}
              />
            )
          })}
        </main>  
      </div>      
    </div>
  )
}
