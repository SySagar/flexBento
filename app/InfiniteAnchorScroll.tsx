import React from 'react'

interface CarouselItem {
  id: number
  text: string
  link: string
}

const items: CarouselItem[] = [
  { id: 1, text: 'Groovy-Box', link: 'https://ui.soumyasagar.in/' },
  { id: 2, text: 'Gitemo-CLI', link: 'https://gitemo.soumyasagar.in/' },
  { id: 3, text: 'Ear-Pluggables', link: 'https://ear-pluggables.soumyasagar.in/' },
  { id: 4, text: 'Pensdown', link: 'https://pensdown.soumyasagar.in/' },
  { id: 5, text: 'Readme-Dev', link: 'https://readme-dev-seven.vercel.app/' }
]

export default function Component() {
  const duplicatedItems = [...items, ...items, ...items]

  return (
    <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="h-full overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full animate-scroll">
          {duplicatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="p-4 border-b text-center border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <a
                href={item.link}
                className="text-blue-600 hover:text-blue-800 text-center w-full hover:underline transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.text}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}