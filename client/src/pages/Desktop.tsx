import {
  ChevronRightIcon,
  CopyIcon,
  EditIcon,
  MenuIcon,
  PaperclipIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const Desktop = (): JSX.Element => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const conversationItems = [
    {
      text: "Crude apa saja yang diolah pa...",
      isActive: true,
      bgColor: "bg-[#b4b4b4]",
      textColor: "text-black",
    },
    {
      text: "apa produk yang dihasilkan sel...",
      isActive: false,
      bgColor: "bg-[#b4b4b48c]",
      textColor: "text-[#0000008c]",
    },
    {
      text: "Unit proses apa yang sering m...",
      isActive: false,
      bgColor: "bg-[#b4b4b48c]",
      textColor: "text-[#0000008c]",
    },
  ];

  const settingsMenuItems = [
    {
      icon: "/figmaAssets/image-1.png",
      label: "AI Configuration",
      hasArrow: true,
    },
    {
      icon: "/figmaAssets/vector-12.svg",
      label: "Theme",
      hasArrow: false,
    },
    {
      icon: "/figmaAssets/vector-2.svg",
      label: "Token Usage",
      hasArrow: false,
    },
    {
      icon: "/figmaAssets/vector-3.svg",
      label: "Profile",
      hasArrow: false,
    },
  ];

  return (
    <div className="bg-white grid justify-items-center [align-items:start] w-screen">
      <div className="bg-white w-[1920px] h-[1080px] relative">
        {/* Left Sidebar */}
        <aside className="absolute w-[411px] h-[1080px] top-0 left-0 bg-[#e6e6e6]">
          {/* Top Navigation */}
          <div className="absolute w-[30px] h-[30px] top-8 left-[31px]">
            <Button
              variant="ghost"
              size="icon"
              className="w-[30px] h-[30px] p-0"
            >
              <MenuIcon className="w-[30px] h-[30px]" />
            </Button>
          </div>

          <div className="absolute w-[30px] h-[30px] top-8 left-[332px]">
            <Button
              variant="ghost"
              size="icon"
              className="w-[30px] h-[30px] p-0"
            >
              <SearchIcon className="w-[30px] h-[30px]" />
            </Button>
          </div>

          {/* New Conversation Button */}
          <Button
            variant="ghost"
            className="absolute w-[253px] h-[30px] top-[150px] left-[31px] justify-start p-0 h-auto"
          >
            <PlusIcon className="w-[30px] h-[30px] mr-[21px]" />
            <span className="[font-family:'Inter',Helvetica] font-normal text-black text-[23px] tracking-[0] leading-[normal]">
              New Conversation
            </span>
          </Button>

          {/* Conversation Section */}
          <div className="absolute w-[378px] h-[790px] top-[275px] left-7">
            <h2 className="absolute w-[131px] top-[-31px] left-1 [font-family:'Inter',Helvetica] font-normal text-[#656565] text-xl tracking-[0] leading-[normal]">
              Conversation
            </h2>

            {/* Chat Background */}
            <div className="absolute w-[346px] h-[701px] top-0 left-[3px]">
              <img
                className="w-full h-full object-cover"
                alt="Rectangle"
                src="/figmaAssets/rectangle-3.svg"
              />
            </div>

            {/* Scrollbar */}
            <div className="absolute w-1.5 h-[681px] top-2.5 left-[338px] bg-[#9f9f9f] rounded-[15px]" />

            {/* Conversation Items */}
            {conversationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`absolute w-[322px] h-[42px] top-[${index === 0 ? "10px" : index === 1 ? "59px" : "108px"}] left-[11px] p-0 h-auto`}
              >
                <div className="relative w-[324px] h-[42px]">
                  <div className="absolute w-[324px] h-[42px] top-0 left-0">
                    <div
                      className={`${item.bgColor} relative w-[322px] h-[42px] rounded-[5px]`}
                    >
                      <div
                        className={`absolute w-[304px] top-[9px] left-[7px] [font-family:'Inter',Helvetica] font-normal ${item.textColor} text-lg tracking-[0] leading-[normal]`}
                      >
                        {item.text}
                      </div>
                    </div>
                  </div>
                  <img
                    className="absolute w-[3px] h-5 top-[11px] left-[309px]"
                    alt="Vector"
                    src="/figmaAssets/vector.svg"
                  />
                </div>
              </Button>
            ))}

            {/* SettingsIcon MenuIcon Popup */}
            <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute w-[349px] h-[54px] top-[731px] left-0 bg-[#b5b4b4] rounded-[15px] p-0 h-auto"
                >
                  <div className="absolute w-[135px] h-[30px] top-[12px] left-[11px] flex items-center">
                    <SettingsIcon className="w-[30px] h-[30px] mr-[13px]" />
                    <span className="[font-family:'Inter',Helvetica] font-normal text-black text-[23px] tracking-[0] leading-[normal]">
                      SettingsIcon
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="absolute w-[227px] h-48 top-[-158px] left-[151px] bg-white shadow-[4px_4px_4px_#00000040] p-0"
                align="start"
              >
                <div className="p-0">
                  {settingsMenuItems.map((menuItem, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`w-full h-[25px] ${index === 0 ? "mt-[13px]" : index === 1 ? "mt-[20px]" : index === 2 ? "mt-[20px]" : "mt-[20px]"} mb-[20px] justify-start px-6 h-auto`}
                    >
                      <div className="flex items-center w-full">
                        <img
                          className="w-[25px] h-[25px] mr-[18px]"
                          alt={menuItem.label}
                          src={menuItem.icon}
                        />
                        <span className="[font-family:'Inter',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                          {menuItem.label}
                        </span>
                        {menuItem.hasArrow && (
                          <ChevronRightIcon className="w-[5px] h-[11px] ml-auto" />
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <img
              className="absolute w-[27px] h-[27px] top-[763px] left-[43px]"
              alt="Vector"
              src="/figmaAssets/vector-1.svg"
            />
          </div>
        </aside>

        {/* Header */}
        <header className="absolute w-[1507px] h-[71px] top-0 left-[411px] bg-[url(/figmaAssets/frame-2.svg)] bg-[100%_100%]">
          <Avatar className="absolute w-[60px] h-[60px] top-1.5 left-[22px]">
            <AvatarImage src="/figmaAssets/icon-1.png" alt="Icon" />
            <AvatarFallback>NI</AvatarFallback>
          </Avatar>
        </header>

        {/* Main Content Area */}
        <main className="absolute w-[1067px] top-[79px] left-[646px]">
          {/* Scrollbar */}
          <div className="absolute w-[13px] h-[975px] top-0 left-[1253px] bg-[#d9d9d9] rounded-[10px]" />

          {/* UserIcon Message */}
          <Card className="absolute w-[487px] h-[49px] top-[18px] left-[573px] bg-[#d9d9d9] rounded-[10px] border-0">
            <CardContent className="p-0">
              <div className="absolute top-3 left-[18px] [font-family:'Inter',Helvetica] font-normal text-black text-[19px] tracking-[0] leading-[normal]">
                Crude apa saja yang diolah pada bulan Mei 2025 ?
              </div>
            </CardContent>
          </Card>

          {/* Message Actions */}
          <div className="absolute top-[75px] left-[1003px] flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-[15px] h-[15px] p-0"
            >
              <CopyIcon className="w-[15px] h-[15px]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-[15px] h-[15px] p-0"
            >
              <EditIcon className="w-[15px] h-[15px]" />
            </Button>
          </div>

          {/* AI Response */}
          <div className="absolute w-[1067px] h-[324px] top-[154px] left-0">
            <div className="w-[1067px] [font-family:'Inter',Helvetica] font-normal text-black text-[19px] tracking-[0] leading-[35px]">
              Pada bulan Mei 2025, unit pengolahan di Kilang Cilacap mengolah
              kombinasi dari beberapa jenis minyak mentah (crude oil) untuk
              memenuhi spesifikasi produk dan optimasi biaya operasional.
              <br />
              Jenis Crude Oil yang Diolah:
              <br />
              Minas Crude: Merupakan crude oil yang diproduksi secara domestik
              dari sumur minyak di Indonesia. Ini adalah minyak mentah yang
              stabil dengan kadar sulfur rendah, sering digunakan sebagai base
              load di kilang kami.
              <br />
              Saudi Light Crude: Diimpor dari Arab Saudi, minyak mentah ini
              memiliki kandungan sulfur yang moderat dan gravitasi API yang
              lebih ringan, sangat ideal untuk menghasilkan bensin dan nafta
              berkualitas tinggi.
              <br />
              WTI (West Texas Intermediate) Crude: Jenis minyak mentah ini
              berasal dari Amerika Serikat. Digunakan sebagai topping untuk
              meningkatkan produksi produk-produk distillate ringan seperti
              avtur dan kerosene.
            </div>
          </div>

          {/* Response Actions */}
          <img
            className="absolute w-20 h-[15px] top-[478px] left-[13px]"
            alt="Group"
            src="/figmaAssets/group-13.png"
          />
        </main>

        {/* Input Area */}
        <div className="absolute w-[1067px] h-[118px] top-[936px] left-[646px] bg-[#eaeaea] rounded-[15px]">
          <Input
            placeholder="Drop Your Question"
            className="absolute top-6 left-[31px] bg-transparent border-0 [font-family:'Inter',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal] placeholder:text-black focus-visible:ring-0"
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute w-[22px] h-[22px] top-[79px] left-[31px] p-0"
          >
            <PaperclipIcon className="w-[22px] h-[22px]" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute w-[19px] h-[21px] top-[25px] left-[1021px] p-0"
          >
            <SendIcon className="w-[19px] h-[21px]" />
          </Button>
        </div>
      </div>
    </div>
  );
};
