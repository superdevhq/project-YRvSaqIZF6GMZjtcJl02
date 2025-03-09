
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define the post type
interface Post {
  id: string;
  author: {
    name: string;
    profilePic: string;
    initials: string;
  };
  content: string;
  likes: number;
  comments: number;
  date: string;
}

const Index = () => {
  const [url, setUrl] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
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
    setPosts([]);

    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('extract-facebook-posts', {
        body: { url }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.posts) {
        setPosts(data.posts);
        toast({
          title: "Success!",
          description: `Successfully extracted ${data.posts.length} posts from the group`,
        });
      } else {
        toast({
          title: "No posts found",
          description: "No posts were found in this group or the group might be private",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error extracting posts:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to extract posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            Powered by Apify Facebook Posts Extractor
          </CardFooter>
        </Card>

        {loading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-2 text-gray-600">Extracting posts from Facebook...</p>
          </div>
        )}

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

        {!loading && posts.length === 0 && url && (
          <div className="text-center py-10">
            <p className="text-gray-600">No posts found. Try another Facebook group.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
