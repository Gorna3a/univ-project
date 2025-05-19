import * as React from "react"
import { ChallengeData } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"

interface ChallengesCarouselProps {
  challenges: ChallengeData[]
}

const difficultyOrder = {
  easy: 1,
  medium: 2,
  hard: 3
} as const

type Difficulty = keyof typeof difficultyOrder

export function ChallengesCarousel({ challenges }: ChallengesCarouselProps) {
  // Sort challenges by difficulty
  const sortedChallenges = [...challenges].sort((a, b) => {
    return difficultyOrder[a.difficulty as Difficulty] - difficultyOrder[b.difficulty as Difficulty]
  })

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Coding Challenges
          </h2>
          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0">
              <ChevronLeft className="h-4 w-4" />
            </CarouselPrevious>
            <CarouselNext className="static translate-y-0">
              <ChevronRight className="h-4 w-4" />
            </CarouselNext>
          </div>
        </div>
        
        <CarouselContent>
          {sortedChallenges.map((challenge, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="h-full flex flex-col">
                  <CardHeader className="flex-row items-center gap-4 pb-2">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {challenge.difficulty[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg line-clamp-1">
                        {challenge.question.split('\n')[0]}
                      </CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        challenge.difficulty === 'easy' 
                          ? 'bg-green-100 text-green-800' 
                          : challenge.difficulty === 'medium' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {challenge.question}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {challenge.xp} XP
                      </span>
                      <Button 
                        size="sm" 
                        className="text-xs"
                        onClick={() => navigate(`/challenges/${challenge.id}`)}
                      >
                        Try Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}