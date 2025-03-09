
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

// Mock data for Facebook posts
const MOCK_POSTS = [
  {
    id: "1",
    author: {
      name: "Jane Smith",
      profilePic: "https://i.pravatar.cc/150?img=1",
      initials: "JS"
    },
    content: "Just launched our new product! Check it out at our website. #newproduct #launch",
    likes: 42,
    comments: 7,
    date: "2 hours ago"
  },
  {
    id: "2",
    author: {
      name: "John Doe",
      profilePic: "https://i.pravatar.cc/150?img=2",
      initials: "JD"
    },
    content: "We're hosting a virtual meetup next week to discuss the latest trends in our industry. Everyone is welcome to join! Link in the comments.",
    likes: 28,
    comments: 15,
    date: "5 hours ago"
  },
  {
    id: "3",
    author: {
      name: "Sarah Johnson",
      profilePic: "https://i.pravatar.cc/150?img=3",
      initials: "SJ"
    },
    content: "Looking for recommendations on the best tools for remote collaboration. What's working well for your team?",
    likes: 35,
    comments: 23,
    date: "1 day ago"
  },
  {
    id: "4",
    author: {
      name: "Michael Brown",
      profilePic: "https://i.pravatar.cc/150?img=4",
      initials: "MB"
    },
    content: "Just shared an article on our blog about improving productivity while working from home. Link in bio!",
    likes: 19,
    comments: 5,
    date: "2 days ago"
  },
];

const Index = () => {
  const [url, setUrl] = useState("");
  const [posts, setPosts] = useState<typeof MOCK_POSTS>([]);
  const [loading, setLoading] = useState(false);

  const handleExtract = () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a Facebook group URL",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    if (!url.includes("facebook.com/groups/")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Facebook group URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoading(false);
      toast({
        title: "Success!",
        description: "Successfully extracted posts from the group",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Facebook Group Post Extractor</h1>
          <p className="text-gray-600">Extract up to 10 recent posts from any Facebook group</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Extract Posts</CardTitle>
            <CardDescription>
              Enter the URL of a Facebook group to extract recent posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="https://www.facebook.com/groups/example"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleExtract} disabled={loading}>
                {loading ? "Extracting..." : "Extract Posts"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-gray-500">
            Note: Currently using mock data. Integration with Apify coming soon.
          </CardFooter>
        </Card>

        {posts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Extracted Posts</h2>
            
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={post.author.profilePic} alt={post.author.name} />
                        <AvatarFallback>{post.author.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{post.author.name}</div>
                        <div className="text-xs text-gray-500">{post.date}</div>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
                  </div>
                  <Separator />
                  <div className="px-4 py-2 text-sm text-gray-500 flex justify-between">
                    <span>❤️ {post.likes} likes</span>
                    <span>💬 {post.comments} comments</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
