import React, { useState } from "react";
import { Phone, Video, Search, Send, User } from "lucide-react";

const Discussions = () => {
  // Mock conversations data
  const conversations = [
    { 
      id: 1, 
      user: "Mamadou Diop", 
      issue: "Connection Problem", 
      lastMessage: "Ma connexion est très lente depuis 2 jours.", 
      timestamp: "10:33", 
      unread: true,
      avatar: "/assets/profiles/mamadou.jpg"
    },
    { 
      id: 2, 
      user: "Fatou Mbaye", 
      issue: "Billing Issue", 
      lastMessage: "Je n'ai pas reçu ma facture ce mois-ci.", 
      timestamp: "09:15", 
      unread: false,
      avatar: "/assets/profiles/fatou-m.jpg"
    },
    { 
      id: 3, 
      user: "Ibrahim Seck", 
      issue: "Plan Upgrade", 
      lastMessage: "Comment puis-je passer au forfait Premium?", 
      timestamp: "Hier", 
      unread: false,
      avatar: "/assets/profiles/ibrahim.jpg"
    },
    { 
      id: 4, 
      user: "Aminata Diallo", 
      issue: "Technical Support", 
      lastMessage: "Mon modem ne fonctionne plus après la coupure d'électricité.", 
      timestamp: "Hier", 
      unread: true,
      avatar: "/assets/profiles/aminata.jpg"
    },
    { 
      id: 5, 
      user: "Omar Faye", 
      issue: "Network Coverage", 
      lastMessage: "Y a-t-il une panne dans la zone de Parcelles?", 
      timestamp: "14/04", 
      unread: false,
      avatar: "/assets/profiles/omar-f.jpg"
    },
    { 
      id: 6, 
      user: "Aicha Ndiaye", 
      issue: "Account Login", 
      lastMessage: "Je n'arrive pas à me connecter à mon compte.", 
      timestamp: "14/04", 
      unread: false,
      avatar: "/assets/profiles/aicha.jpg"
    },
    { 
      id: 7, 
      user: "Cheikh Diagne", 
      issue: "Payment Method", 
      lastMessage: "Comment puis-je changer ma méthode de paiement?", 
      timestamp: "13/04", 
      unread: false,
      avatar: "/assets/profiles/cheikh.jpg"
    },
    { 
      id: 8, 
      user: "Marie Mendy", 
      issue: "Service Outage", 
      lastMessage: "Est-ce qu'il y a une panne générale? Je n'ai plus de connexion.", 
      timestamp: "13/04", 
      unread: false,
      avatar: "/assets/profiles/marie.jpg"
    }
  ];

  const [activeConversation, setActiveConversation] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  
  // Filter conversations based on search
  const filteredConversations = conversations.filter(
    convo => convo.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
             convo.issue.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get the active conversation
  const currentConversation = conversations.find(c => c.id === activeConversation);
  
  // Mock messages for the active conversation
  const messages = [
    { id: 1, content: "Bonjour! Comment puis-je vous aider aujourd'hui?", sender: "admin", timestamp: "10:30" },
    { id: 2, content: "Je rencontre des problèmes avec ma connexion internet.", sender: "user", timestamp: "10:31" },
    { id: 3, content: "Je suis désolé pour ce désagrément. Pouvez-vous me donner plus d'informations sur le problème que vous rencontrez?", sender: "admin", timestamp: "10:32" },
    { id: 4, content: "Ma connexion est très lente depuis 2 jours.", sender: "user", timestamp: "10:33" },
    { id: 5, content: "Avez-vous essayé de redémarrer votre modem?", sender: "admin", timestamp: "10:34" },
    { id: 6, content: "Oui, j'ai déjà essayé ça plusieurs fois mais ça ne change rien.", sender: "user", timestamp: "10:36" },
    { id: 7, content: "D'accord, je comprends. Pouvez-vous me donner votre adresse exacte pour que je puisse vérifier s'il y a des problèmes connus dans votre zone?", sender: "admin", timestamp: "10:37" },
    { id: 8, content: "J'habite à Parcelles Assainies Unité 15, Villa 123.", sender: "user", timestamp: "10:38" },
    { id: 9, content: "Merci pour cette information. Je vois qu'il y a effectivement des travaux de maintenance dans votre zone qui peuvent affecter la qualité de la connexion. Ces travaux devraient être terminés d'ici demain.", sender: "admin", timestamp: "10:40" },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log("Message sent:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="animate-enter h-[calc(100vh-7rem)]">
      <h1 className="dashboard-title">Discussions</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-11rem)]">
        {/* Conversations list */}
        <div className="dashboard-card flex flex-col h-full">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <Search size={16} />
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full p-2 pl-10 text-sm rounded-md bg-muted/40 text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredConversations.map((convo) => (
              <div 
                key={convo.id}
                onClick={() => setActiveConversation(convo.id)}
                className={`p-3 rounded-lg cursor-pointer ${
                  activeConversation === convo.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {convo.avatar ? (
                      <img
                        src={convo.avatar}
                        alt={convo.user}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted/60 rounded-full flex items-center justify-center text-muted-foreground">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{convo.user}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">
                        {convo.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-accent font-medium">{convo.issue}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {convo.lastMessage}
                    </p>
                  </div>
                  {convo.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            ))}
            
            {filteredConversations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No conversations found
              </div>
            )}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="dashboard-card lg:col-span-2 flex flex-col h-full">
          {currentConversation ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center">
                  {currentConversation.avatar ? (
                    <img 
                      src={currentConversation.avatar} 
                      alt={currentConversation.user}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted/60 rounded-full flex items-center justify-center text-muted-foreground">
                      <User size={20} />
                    </div>
                  )}
                  <div className="ml-3">
                    <h3 className="font-medium">{currentConversation.user}</h3>
                    <p className="text-xs text-muted-foreground">{currentConversation.issue}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full hover:bg-muted/40 text-primary">
                    <Phone size={18} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-muted/40 text-primary">
                    <Video size={18} />
                  </button>
                </div>
              </div>
              
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${
                      message.sender === "admin" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div 
                      className={`max-w-[70%] px-4 py-2 rounded-lg ${
                        message.sender === "admin" 
                          ? "bg-muted/40 text-foreground" 
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className={`text-xs mt-1 ${
                        message.sender === "admin" 
                          ? "text-muted-foreground" 
                          : "text-primary-foreground/70"
                      }`}>
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message input */}
              <form onSubmit={handleSendMessage} className="pt-4 border-t border-border flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                  type="submit"
                  className="btn btn-primary flex items-center"
                  disabled={!newMessage.trim()}
                >
                  <Send size={16} className="mr-1" /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discussions;
