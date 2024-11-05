'use client'

import React, { useState, useEffect } from 'react'
import { PlusCircle, Code, Trash } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

const CustomDragLayerStyle = () => (
  <style jsx global>{`
    .react-grid-placeholder {
      background: transparent !important;
      transition: none !important;
    }
  `}</style>
)

const ResponsiveGridLayout = WidthProvider(Responsive)

type BoxContent = {
  type: 'image' | 'component' | 'video' | 'text'
  content: string
}

type BoxProps = {
  i: string
  x: number
  y: number
  w: number
  h: number
  gridArea: string
  onAddContent: (content: BoxContent) => void
  onDelete: () => void
  content?: BoxContent
}

const ContentForm: React.FC<{
  type: BoxContent['type'],
  onSubmit: (content: BoxContent) => void
}> = ({ type, onSubmit }) => {
  const [content, setContent] = useState('')
  
  const predefinedComponents = {
    button: '<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Click me</button>',
    card: '<div class="p-4 text-black bg-white rounded-lg shadow-md"><h3 class="text-lg font-bold mb-2">Card Title</h3><p>Card content goes here</p></div>',
    alert: '<div class="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">Important alert message!</div>',
    stat: '<div class="text-center"><div class="text-3xl font-bold">100+</div><div class="text-gray-600">Users</div></div>'
  }

  const renderFormFields = () => {
    switch (type) {
      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input 
                placeholder="Enter image URL or choose sample"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label>Text Content</Label>
              <Textarea
                placeholder="Enter your text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <Label>Text Styles</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { label: 'Regular', style: 'text-base' },
                  { label: 'Large', style: 'text-2xl font-bold' },
                  { label: 'Heading', style: 'text-3xl font-bold text-blue-600' },
                  { label: 'Accent', style: 'text-xl font-medium text-purple-600' }
                ].map((style) => (
                  <button
                    key={style.label}
                    className={`p-2 text-left border rounded-md hover:bg-gray-50 ${style.style}`}
                    onClick={() => setContent(content || 'Sample Text')}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'component':
        return (
          <div className="space-y-4">
            <div>
              <Label>Component JSX</Label>
              <Textarea
                placeholder="Enter component JSX..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 font-mono text-sm"
                rows={6}
              />
            </div>
            <div>
              <Label>Predefined Components</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(predefinedComponents).map(([name, jsx]) => (
                  <button
                    key={name}
                    className="p-2 text-left border rounded-md hover:bg-gray-50"
                    onClick={() => setContent(jsx)}
                  >
                    <div className="font-medium capitalize mb-1">{name}</div>
                    <div className="text-xs text-gray-500 truncate">{jsx}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <Label>Video URL (MP4)</Label>
              <Input 
                placeholder="Enter video URL"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="text-sm text-gray-500">
              Supported format: MP4. Please ensure the video URL is publicly accessible.
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {renderFormFields()}
      <Button 
        className="w-full"
        onClick={() => content && onSubmit({ type, content })}
      >
        Add Content
      </Button>
    </div>
  )
}

const Box: React.FC<BoxProps & { className?: string }> = ({ i, onAddContent, onDelete, content, className }) => {
  const [selectedType, setSelectedType] = useState<BoxContent['type']>('text');

  const renderContent = () => {
    if (!content) return null;
    switch (content.type) {
      case 'image':
        return (
          <div className="w-full h-full">
            <img 
              src={content.content} 
              alt="Box content" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        );
      case 'component':
        return (
          <div className="w-full h-full flex justify-center items-center rounded-lg  overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        );
      case 'video':
        return (
          <div className="w-full h-full">
            <video 
              src={content.content} 
              controls 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        );
      case 'text':
        return (
          <div className="w-full h-full flex items-center justify-center rounded-lg border-2">
             <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
            content ? 'bg-transparent' : 'bg-gray-200'
          } ${className}`}
        >
          {renderContent()}
          {!content && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
              <PlusCircle size={24} />
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <Dialog>
          <DialogTrigger asChild>
            <ContextMenuItem onSelect={(event) => event.preventDefault()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Add Content</span>
            </ContextMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Content</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content-type" className="text-right">
                  Type
                </Label>
                <select 
                  id="content-type" 
                  className="col-span-3 p-2 border rounded-md"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as BoxContent['type'])}
                >
                  <option value="image">Image</option>
                  <option value="component">Component</option>
                  <option value="video">Video</option>
                  <option value="text">Text</option>
                </select>
              </div>
              <ContentForm 
                type={selectedType} 
                onSubmit={onAddContent}
              />
            </div>
          </DialogContent>
        </Dialog>
        <ContextMenuItem onClick={onDelete}>
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const SouthEastArrow = () => (
  <svg width="20px" height="20px" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <g transform="rotate(-45 50 50)">
    <path d="M25,50 L50,75 L75,50" fill="none" stroke="#fff" strokeWidth="6" />
  </g>
</svg>
);

const CustomHandle = (props:any) => (
  <div
    style={{
      borderRadius: "2px",
      position: "absolute",
      bottom: 0,
      right: 0,
      padding: 0,
      cursor: "se-resize"
    }}
    {...props}
  />
);

const BottomRightHandle = () => (
  <CustomHandle>
    <SouthEastArrow />
  </CustomHandle>
);


const BentoGrid: React.FC = () => {
  const [boxes, setBoxes] = useState<BoxProps[]>([
    { i: 'header', x: 0, y: 0, w: 1.5, h: 2, gridArea: 'header', onAddContent: () => {}, onDelete: () => {}, content: { type: 'text', content: 'Tech Arsenal' } },
    { i: 'stats1', x: 1.5, y: 0, w: 2.5, h: 4.5, gridArea: 'stats1', onAddContent: () => {}, onDelete: () => {}, content: { type: 'text', content: '56+ Projects' } },
    { i: 'stats2', x: 4, y: 0, w: 2.5, h: 2.7, gridArea: 'stats2', onAddContent: () => {}, onDelete: () => {} },
    { i: 'stats3', x: 0, y: 2, w: 1.5, h: 2, gridArea: 'stats3', onAddContent: () => {}, onDelete: () => {} },
    { i: 'stats4', x: 0, y: 4.5, w: 1.5, h: 2, gridArea: 'stats4', onAddContent: () => {}, onDelete: () => {} },  
    { i: 'stats5', x: 4, y: 2, w: 2.5, h: 1.78, gridArea: 'stats4', onAddContent: () => {}, onDelete: () => {} },  
    { i: 'stats6', x: 1.5, y: 4, w: 1.5, h: 1.5, gridArea: 'stats4', onAddContent: () => {}, onDelete: () => {} },  
    { i: 'main', x: 3, y: 5, w: 3.5, h: 1.5, gridArea: 'main', onAddContent: () => {}, onDelete: () => {}, content: { type: 'image', content: 'https://images.unsplash.com/photo-1709884735626-63e92727d8b6?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  ])

  const handleAddContent = (index: number, content: BoxContent) => {
    setBoxes(prevBoxes => 
      prevBoxes.map((box, i) => 
        i === index ? { ...box, content } : box
      )
    )
  }

  const handleDeleteBox = (index: number) => {
    setBoxes(prevBoxes => {
      const newBoxes = prevBoxes.filter((_, i) => i !== index)
      return centerGrid(newBoxes)
    })
  }

  const handleAddBox = () => {
    setBoxes(prevBoxes => {
      const newBox: BoxProps = {
        i: `box-${Date.now()}`,
        x: 0,
        y: Infinity,
        w: 1,
        h: 1,
        gridArea: `new-box-${Date.now()}`,
        onAddContent: () => {},
        onDelete: () => {},
      }
      const newBoxes = [...prevBoxes, newBox]
      return centerGrid(newBoxes)
    })
  }

  const centerGrid = (boxes: BoxProps[]): BoxProps[] => {
    const sortedBoxes = [...boxes].sort((a, b) => a.y - b.y || a.x - b.x)
    let minX = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    sortedBoxes.forEach(box => {
      minX = Math.min(minX, box.x)
      maxX = Math.max(maxX, box.x + box.w)
      maxY = Math.max(maxY, box.y + box.h)
    })

    const gridWidth = 10
    const centerX = Math.floor((gridWidth - (maxX - minX)) / 2)
    const xOffset = centerX - minX

    return  sortedBoxes.map(box => ({
      ...box,
      x: box.x + xOffset
    }))
  }

  useEffect(() => {
    setBoxes(prevBoxes => centerGrid(prevBoxes))
  }, [])

  const extractCode = () => {
    const code = `
import React, { useState, useEffect } from 'react'
import { PlusCircle, Code, Trash } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

${Box.toString()}

${BentoGrid.toString()}

export default BentoGrid
    `
    navigator.clipboard.writeText(code).then(() => {
      console.log("Code copied to clipboard")
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  const onLayoutChange = (layout: any) => {
    setBoxes(prevBoxes => 
      prevBoxes.map(box => {
        const updatedPosition = layout.find((item: any) => item.i === box.i)
        return updatedPosition ? { ...box, ...updatedPosition } : box
      })
    )
  }

  return (
    <div className="p-4 bg-[#09090b] text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bento Grid</h1>
        <Button onClick={extractCode} className='text-black' variant="outline">
          <Code className="mr-2 h-4 w-4" /> Extract Code
        </Button>
      </div>
      <div className='mx-80'>
        
      <CustomDragLayerStyle />
      <ContextMenu>
        <ContextMenuTrigger >
          <ResponsiveGridLayout
            className="layout custom-drag-layer "
            layouts={{ lg: boxes }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 10, md: 8, sm: 5, xs: 2, xxs: 1 }}
            rowHeight={100}
            width={1200}
            onLayoutChange={onLayoutChange}
            isDraggable={true}
            isResizable={true}
            resizeHandles={["se"]}
            resizeHandle={<BottomRightHandle />}
            draggableCancel=".react-resizable-handle"
          >
            {boxes.map((box, index) => (
              <div key={box.i} className="">
                <Box 
                  {...box} 
                  onAddContent={(content) => handleAddContent(index, content)} 
                  onDelete={() => handleDeleteBox(index)}
                  className="w-full h-full"
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleAddBox}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Add New Box</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      
      </div>
      
    </div>
  )
}

export default BentoGrid